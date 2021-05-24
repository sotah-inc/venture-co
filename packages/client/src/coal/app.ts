import firebase from "firebase/app";

import "firebase/auth";

let firebaseApp: firebase.app.App;

export function resolveFirebaseApp(browserApiKey: string): firebase.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }

  firebaseApp = firebase.initializeApp({
    apiKey: browserApiKey,
  });

  return firebaseApp;
}
