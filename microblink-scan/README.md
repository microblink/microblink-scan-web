# Microblink Scan App

This is Angular application which handle exchange link routing for (Microblink API UI component (microblink-js))[https://github.com/microblink/microblink-js].  

This application is opened at smartphone when desktop-to-mobile feature is requested by user at `microblink-js`.

## Setup Firebase credentials

Change credentials at files:

`./apps/public/scan-client/src/environments/`
- `environment.prod.ts`
- `environment.staging.ts`
- `environment.ts`

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


