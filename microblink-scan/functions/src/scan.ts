import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as urlBuilder from 'build-url'
import * as request from 'request-promise'

const db = admin.firestore()

// Build Firebase Dynamic Link
function makeDynamicLongLink(scanId) {
  return urlBuilder(`${functions.config().applinks.link}`, {
      queryParams: {
          link: `${functions.config().applinks.redirect_url_prefix}/${scanId}`
      }
  });
}

// Build Firebase Dynamic Links request.options
function makeRequestOptions(scanId) {
  return {
      method: 'POST',
      uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${functions.config().applinks.key}`,
      body: {
          "longDynamicLink": makeDynamicLongLink(scanId)
      },
      json: true
  };
}

// On Create trigger for Firestore documents 'scan/*'
export const onCreate = functions.firestore
  .document('scan/{scanId}')
  .onCreate(async (snapshot, context) => {
  
      const data = snapshot.data();
      const scanId = snapshot.id;

      try {
        const parsedBody = await request(makeRequestOptions(scanId));
        data.shortLink = parsedBody.shortLink
        console.log('shortLinks.parsedBody', parsedBody)
      } catch (e) {
        data.shortLink = null
      }
      
      return db.doc(`scan/${snapshot.id}`).create(data)
});

