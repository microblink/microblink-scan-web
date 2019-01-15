import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as urlBuilder from 'build-url'
import * as request from 'request-promise'

const db = admin.firestore()

// Build Firebase Dynamic Link
function makeDynamicLongLink(scanId: string, key: string) {
  return urlBuilder(`${functions.config().applinks.link}`, {
      queryParams: {
          link: `${functions.config().applinks.redirect_url_prefix}/${scanId}?key=${key}`
      }
  });
}

// Build Firebase Dynamic Links request.options
function makeRequestOptions(scanId: string, key: string) {
  return {
      method: 'POST',
      uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${functions.config().applinks.key}`,
      body: {
          "longDynamicLink": makeDynamicLongLink(scanId, key),
          "suffix": {
            "option": "SHORT"
            // By default, or if you set the parameter to "UNGUESSABLE", the path component will be a 17-character string
            // If you set the parameter to "SHORT", the path component will be a string that is only as long as needed to be unique, with a minimum length of 4 characters.
          }
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

      const key = data.key
      delete data.key

      try {
        const parsedBody = await request(makeRequestOptions(scanId, key));
        data.shortLink = parsedBody.shortLink
        console.log('shortLinks.parsedBody', parsedBody)
      } catch (e) {
        data.shortLink = null
      }

      // Only for development to preview data in remote Firestore
      if (process.env.NODE_ENV === 'dev') {
        return db.doc(`scan/${snapshot.id}`).create(data)
      }

      return null;
});

