# Microblink Scan App

This is Angular application which handle exchange link routing for (Microblink API UI component (microblink-js))[https://github.com/microblink/microblink-js].  

This application should be opened at smartphone when desktop-to-mobile feature is requested by user at desktop in `microblink-js`.

## Setup Firebase credentials

1. Create two (`production` and `staging/dev`) Firebase projects at your Google account

2 .Change credentials at files:

- `./apps/public/scan-client/src/environments/environment.prod.ts`
- `./apps/public/scan-client/src/environments/environment.staging.ts`
- `./apps/public/scan-client/src/environments/environment.ts`

## Setup Firebase Hosting

Configure Firebase hosting with your custom domain where this single-page application will be deployed.  
`https://console.firebase.google.com/u/0/project/<FIREBASE_PROJECT_ID>/hosting/main`

## Setup Firebase Dynamic Links

For shorting generated exchange URL it is recommended to use `Firebase Dynamic Links`.  
`https://console.firebase.google.com/u/0/project/<FIREBASE_PROJECT_ID>/durablelinks`  

URL which should be shortened is `https://<CUSTOM_DOMAIN>/scans/<SCAN_ID>?key<SECRET_ENCRYPTION_KEY>`

This short URL will be also generated in `microblink-js` in QR code.

## Setup Firebase Storage CORS configuration

It is necessary to allow all origins to download files. 
In the root directory of this project a file called `cors.json` has been created with the following contents. 
```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```
To update cors settings for your storage bucket run:
```
gsutil cors set cors.json gs://<YOUR-STORAGE-BUCKET>
```

## Setup Firebase functions ENV variables

Public API key for your Firebase project
```
firebase functions:config:set applinks.key="<FIREBASE_PROJECT_KEY>"
```

Prefix of your application where Angular APP `./apps/public/scan-client` will be deployed + `/scans` route where `scan-page.component` will handle exchange link.
```
firebase functions:config:set applinks.redirect_url_prefix="https://scan.microblink.com/scans"
```

Add Firebase Dynamic links domain at:
https://console.firebase.google.com/u/0/project/<FIREBASE_PROJECT_ID>/durablelinks
```
firebase functions:config:set applinks.link="https://mbe.page.link/"
```

To take effect of ENV variables change deploy Firebase functions
```
firebase use <FIREBASE_PROJECT_ID>
firebase deploy --only functions
```

## Deployment

1. Edit `./deploy.sh` with your `<FIREBASE_PROJECT_IDs>`  
2. Run deploy script `SKIP_FUNCTIONS=true ./deploy.sh production`


