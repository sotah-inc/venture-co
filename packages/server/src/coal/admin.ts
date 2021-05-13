import firebaseAdmin from "firebase-admin";

let firebaseAdminApp: firebaseAdmin.app.App;

export function resolveFirebaseAdminApp(): firebaseAdmin.app.App {
  if (firebaseAdminApp) {
    return firebaseAdminApp;
  }

  firebaseAdminApp =  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
  });

  return firebaseAdminApp;
}
