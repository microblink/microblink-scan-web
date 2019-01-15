#!/bin/bash

if [ "$1" == "production" ]; then
    ENVIRONMENT="prod"
    FIREBASE_PROJECT="microblink-api-exchanger"
else
    ENVIRONMENT="dev"
    FIREBASE_PROJECT="microblink-api-exchanger-dev"
fi

echo "Config variables"
echo "ENVIRONMENT = $ENVIRONMENT"
echo "FIREBASE_PROJECT = $FIREBASE_PROJECT"
echo ""

firebase use $FIREBASE_PROJECT

echo "SKIP_HOSTING=$SKIP_HOSTING"
echo "SKIP_FUNCTIONS=$SKIP_FUNCTIONS"

if [ "$SKIP_HOSTING" == "true" ] ; then
    echo "Skip deploy to Firebase hosting"
else
    if [ "$ENVIRONMENT" == "dev" ]; then
        #ng build --target=production
        echo "dev"
    else
        #ng build --environment $ENVIRONMENT --target=production
        echo "prod"
    fi

    echo "Deploy to Firebase hosting..."
    firebase deploy --only hosting
fi

if [ "$SKIP_FUNCTIONS" == "true" ] ; then
    echo "Skip deploy of Firebase functions"
else
    echo "Deploy of Firebase functions..."
    firebase deploy --only functions
fi
