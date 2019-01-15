// Init app
import * as admin from 'firebase-admin';
admin.initializeApp();

// Import specific files
import * as scan from './scan'

// Export functions
export const onCreateScan = scan.onCreate

