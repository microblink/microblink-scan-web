import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as urlBuilder from 'build-url'
import * as request from 'request-promise'

const db = admin.firestore()

const FIRESTORE_COLLECTION_ID = 'scans'

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
  .document(FIRESTORE_COLLECTION_ID + '/{scanId}')
  .onCreate(async (snapshot, context) => {
  
      const data = snapshot.data();
      const scanId = snapshot.id;

      const key = data.key
      delete data.key

      try {
        const parsedBody = await request(makeRequestOptions(scanId, key));
        // Depends on value at Microblink.SDK.ScanExchangerCodes.Step02_ExchangeLinkIsGenerated
        data.status = 'STEP_2_EXCHANGE_LINK_IS_GENERATED'
        data.shortLink = parsedBody.shortLink
        console.log('shortLinks.parsedBody', parsedBody)
      } catch (e) {
        data.shortLink = null
      }

      // Only for development to preview data in remote Firestore
      if (process.env.NODE_ENV === 'dev') {
        await db.doc(`${FIRESTORE_COLLECTION_ID}/${snapshot.id}`).create(data)
      }

      console.log('beforeSet', data)

      return snapshot.ref.set(data)
});

