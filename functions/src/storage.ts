import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as gcs from '@google-cloud/storage'

// On Create trigger for Storage files
export const onFinalize = functions.storage.object().onFinalize(async (object) => {
  // Delete old (created more than 24 hours) files
  const timeLimit = admin.firestore.Timestamp.now().toDate();
  timeLimit.setDate(timeLimit.getDate() - 1);
  const storage = new gcs.Storage();
  const files = await storage.bucket(object.bucket).getFiles();
  for (const file of files[0]) {
    if (new Date(file.metadata.timeCreated) < timeLimit) {
      await file.delete();
    }
  }
});