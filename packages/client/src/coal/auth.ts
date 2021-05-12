import firebase from "firebase";

const app = firebase.initializeApp({});

export async function registerUser(email: string, password: string): Promise<string | null> {
  const res = await app.auth().createUserWithEmailAndPassword(email, password);

  return res.user?.uid ?? null;
}
