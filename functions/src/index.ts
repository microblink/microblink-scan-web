// Init app
import * as admin from 'firebase-admin';
admin.initializeApp();

// const firestore = new admin.firestore.Firestore();
// const settings = {/* your settings... */ timestampsInSnapshots: true};
// firestore.settings(settings);

// Import specific files
import * as scan from './scan'
import * as storage from './storage'

// Export functions
export const onCreateScan = scan.onCreate
export const onFinalizeStorage = storage.onFinalize

