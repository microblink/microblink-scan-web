// Init app
import * as admin from 'firebase-admin';
admin.initializeApp();

// const firestore = new admin.firestore.Firestore();
// const settings = {/* your settings... */ timestampsInSnapshots: true};
// firestore.settings(settings);

// Import specific files
import * as scan from './scan'

// Export functions
export const onCreateScan = scan.onCreate

