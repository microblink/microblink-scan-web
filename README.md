# Microblink Scan App

This is an Angular application which handles exchange link routing for the (Microblink API UI component (microblink-js))[https://github.com/microblink/microblink-js].  

This application should be opened on a smartphone when desktop-to-mobile feature is requested by the user at a desktop device in `microblink-js`.

## Setup Firebase credentials

1. Create two Firebase projects (`production` and `staging/dev`), with your Google account.

2. Change credentials in files:

- `./apps/public/scan-client/src/environments/environment.prod.ts`
- `./apps/public/scan-client/src/environments/environment.staging.ts`
- `./apps/public/scan-client/src/environments/environment.ts`

## Setup Firestore

Create an empty Firestore database with rules specified in the file `./firestore.rules`.

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /scans/{scan} {    
      allow create, get, update: if true;
      allow list, delete: if false;
    }    
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Setup Firebase Hosting

Configure Firebase hosting with your custom domain, where this single-page application will be deployed.

`https://console.firebase.google.com/u/0/project/<FIREBASE_PROJECT_ID>/hosting/main`

## Setup Firebase Dynamic Links

The generated exchange URL is: `https://<CUSTOM_DOMAIN>/scans/<SCAN_ID>?key<SECRET_ENCRYPTION_KEY>`. 

For shortening URLs, use `Firebase Dynamic Links`:

`https://console.firebase.google.com/u/0/project/<FIREBASE_PROJECT_ID>/durablelinks`  

A shortened URL will also be generated in `microblink-js` in the QR code.

## Setup Firebase Storage

### Rules configuration

Enable storage with the `./storage.rules`.

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow get, create, delete: if true;
      allow list, update: if false;
    }
  }
}
```

### CORS configuration

It is necessary to allow all origins to download files. 
In the root directory of this project there is a `cors.json`, with the following contents:

```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

To update cors settings for your storage bucket, run:

```
gsutil cors set cors.json gs://<YOUR-STORAGE-BUCKET>
```

## Setup Firebase functions ENV variables

- Public API key for your Firebase project:

	```
	firebase functions:config:set applinks.key="<FIREBASE_PROJECT_KEY>"
	```

- The prefix of your application, where the Angular application `./apps/public/scan-client` will be deployed and a `/scans` route where `scan-page.component` will handle the exchange link:

	```
	firebase functions:config:set applinks.redirect_url_prefix="https://scan.microblink.com/scans"
	```

- Add the Firebase Dynamic Links domain at:
https://console.firebase.google.com/u/0/project/<FIREBASE_PROJECT_ID>/durablelinks

	```
	firebase functions:config:set applinks.link="https://mbe.page.link/"
	```

- To take effect of any ENV variable changes, deploy Firebase functions

	```
	firebase use <FIREBASE_PROJECT_ID>
	firebase deploy --only functions
	```

## Deployment

1. Edit `./deploy.sh` with your `<FIREBASE_PROJECT_IDs>`.
2. Run the deploy script `SKIP_FUNCTIONS=true ./deploy.sh production`.


