// firebase-sync.js — shared real-time sync for Pene & Jenna's tracker.
//
// The idea: Pene runs the tracker on a laptop (eventually a TV) as a shared
// display, and controls it from her phone since that's the device closest to
// her in the gym. This file keeps every open device pointed at ONE shared
// Firestore record, so a tick on the phone shows up on the laptop within a
// second or two, no refresh needed. No login screen: each device signs in
// anonymously (silent, no prompt) and everything reads/writes the same fixed
// "pene-jenna" household record.
//
// If Firebase can't be reached (offline, blocked network, etc.) every
// CloudSync method just quietly no-ops — tracker.html and stats.html both
// keep working from local storage exactly as they did before this file
// existed, nothing here is load-bearing for the app to function on one device.
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCWe7tmOv6htgtBknSZVH22MN3Fkv1Vzz0",
    authDomain: "pene-jenna-fitness.firebaseapp.com",
    projectId: "pene-jenna-fitness",
    storageBucket: "pene-jenna-fitness.firebasestorage.app",
    messagingSenderId: "1074398601699",
    appId: "1:1074398601699:web:154f600a1f0f604aca80d6"
  };

  const HOUSE_ID = 'pene-jenna';
  const LS_STATE = 'pj-tracker-state-v1';
  const LS_COMPLETED = 'pj-completed-days-v1';
  const LS_ARCHIVE = 'pj-workout-archive-v1';

  const CloudSync = {
    onStateChange: null,    // (data) => {}  data = {weekIdx, dayIdx, progressJson, completedDays}
    onArchiveChange: null,  // (entries) => {}
    onFitnessTestsChange: null, // (entries) => {}  entries = [{date, tests:[{name, unit, Pene, Jenna}]}]
    isReady: function () { return ready; }
  };
  window.CloudSync = CloudSync;

  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK did not load, tracker will stay local-only on this device.');
    CloudSync.saveState = function () {};
    CloudSync.markDayCompleted = function () {};
    CloudSync.appendArchive = function () {};
    CloudSync.saveEquipment = function () {};
    CloudSync.saveFitnessTestEntry = function () {};
    return;
  }

  let ready = false;
  let db, houseRef, archiveRef;
  let stateUnsub = null, archiveUnsub = null;
  let receivedFirstStateSnapshot = false;
  let localChangedSinceLoad = false;
  let cloudWriteTimer = null;

  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    try { db.enablePersistence({ synchronizeTabs: true }); } catch (e) { /* older browser, still works online */ }
    houseRef = db.collection('households').doc(HOUSE_ID);
    archiveRef = houseRef.collection('archive');
  } catch (e) {
    console.warn('Could not set up cloud sync, staying local-only:', e);
    CloudSync.saveState = function () {};
    CloudSync.markDayCompleted = function () {};
    CloudSync.appendArchive = function () {};
    CloudSync.saveEquipment = function () {};
    CloudSync.saveFitnessTestEntry = function () {};
    return;
  }

  // Debounced: a chip tap or a keystroke in the weight box both funnel through
  // here, this batches rapid taps/typing into one write instead of one per event.
  CloudSync.saveState = function (weekIdx, dayIdx, progress) {
    localChangedSinceLoad = true;
    clearTimeout(cloudWriteTimer);
    cloudWriteTimer = setTimeout(function () {
      if (!ready) return;
      houseRef.set({ weekIdx: weekIdx, dayIdx: dayIdx, progressJson: JSON.stringify(progress) }, { merge: true })
        .catch(function (err) { console.warn('Cloud save failed, still saved on this device:', err); });
    }, 500);
  };

  // arrayUnion so two devices marking different days done around the same
  // moment merge correctly instead of one overwriting the other.
  CloudSync.markDayCompleted = function (key) {
    localChangedSinceLoad = true;
    if (!ready) return;
    houseRef.set({ completedDays: firebase.firestore.FieldValue.arrayUnion(key) }, { merge: true })
      .catch(function (err) { console.warn('Cloud save failed, still saved on this device:', err); });
  };

  CloudSync.appendArchive = function (entry) {
    localChangedSinceLoad = true;
    if (!ready) return;
    archiveRef.add(entry).catch(function (err) { console.warn('Cloud save failed, still saved on this device:', err); });
  };

  // Equipment on hand + free-text notes for Claude, lives on the same shared
  // household record, edited from either device, debounced the same way as
  // saveState so typing doesn't spam Firestore with a write per keystroke.
  let equipmentWriteTimer = null;
  CloudSync.saveEquipment = function (equipment, notes) {
    localChangedSinceLoad = true;
    clearTimeout(equipmentWriteTimer);
    equipmentWriteTimer = setTimeout(function () {
      if (!ready) return;
      houseRef.set({ equipment: equipment, notes: notes, equipmentUpdatedAt: new Date().toISOString() }, { merge: true })
        .catch(function (err) { console.warn('Cloud save failed, still saved on this device:', err); });
    }, 500);
  };

  // A new fitness retest entry, entered from either device via the Fitness
  // Tests page. arrayUnion so two devices logging around the same moment
  // merge instead of one overwriting the other, same pattern as
  // markDayCompleted. entry shape: {date, tests:[{name, unit, Pene, Jenna}]}.
  CloudSync.saveFitnessTestEntry = function (entry) {
    localChangedSinceLoad = true;
    if (!ready) return;
    houseRef.set({ fitnessTestEntries: firebase.firestore.FieldValue.arrayUnion(entry) }, { merge: true })
      .catch(function (err) { console.warn('Cloud save failed, still saved on this device:', err); });
  };

  // Runs once, only the very first time this Firebase project sees no shared
  // record yet. Copies up whatever is already saved in this device's local
  // storage so switching over to cloud sync doesn't lose anything. Only ever
  // fires when the cloud document doesn't exist, so it's safe even if it
  // somehow ran twice.
  async function migrateIfEmpty() {
    try {
      const rawState = localStorage.getItem(LS_STATE);
      const rawCompleted = localStorage.getItem(LS_COMPLETED);
      const rawArchive = localStorage.getItem(LS_ARCHIVE);
      const localState = rawState ? JSON.parse(rawState) : null;
      const localCompleted = rawCompleted ? JSON.parse(rawCompleted) : [];
      const localArchive = rawArchive ? JSON.parse(rawArchive) : [];

      await houseRef.set({
        weekIdx: localState && localState.weekIdx != null ? localState.weekIdx : 0,
        dayIdx: localState && localState.dayIdx != null ? localState.dayIdx : 0,
        progressJson: JSON.stringify(localState && localState.progress ? localState.progress : {}),
        completedDays: localCompleted
      });
      for (const entry of localArchive) {
        await archiveRef.add(entry);
      }
    } catch (e) {
      console.warn('Nothing to migrate (or migration failed), starting fresh in the cloud:', e);
      try { await houseRef.set({ weekIdx: 0, dayIdx: 0, progressJson: '{}', completedDays: [] }); } catch (e2) { /* give up quietly */ }
    }
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) return;
    ready = true;

    if (stateUnsub) stateUnsub();
    stateUnsub = houseRef.onSnapshot(async function (snap) {
      if (!snap.exists) {
        await migrateIfEmpty();
        return;
      }
      // Fitness test entries are append-only (arrayUnion), never overwritten,
      // so there's no clobber risk, fire this on every snapshot regardless of
      // the local-edit guard below that only protects workout progress.
      if (CloudSync.onFitnessTestsChange) CloudSync.onFitnessTestsChange(snap.data().fitnessTestEntries || []);
      if (!receivedFirstStateSnapshot && localChangedSinceLoad) {
        // Something was tapped on this device in the brief window before the
        // cloud connected. Trust that local edit for now rather than clobber
        // it with older cloud data, our own debounced write will push it up
        // in a moment and normal two-way sync continues from there.
        receivedFirstStateSnapshot = true;
        return;
      }
      receivedFirstStateSnapshot = true;
      if (CloudSync.onStateChange) CloudSync.onStateChange(snap.data());
    }, function (err) { console.warn('Cloud sync (state) issue:', err); });

    if (archiveUnsub) archiveUnsub();
    archiveUnsub = archiveRef.orderBy('completedAt', 'asc').onSnapshot(function (snap) {
      const entries = snap.docs.map(function (d) { return d.data(); });
      if (CloudSync.onArchiveChange) CloudSync.onArchiveChange(entries);
    }, function (err) { console.warn('Cloud sync (archive) issue:', err); });
  });

  firebase.auth().signInAnonymously().catch(function (err) {
    console.warn('Anonymous sign-in failed, staying local-only on this device:', err);
  });
})();
