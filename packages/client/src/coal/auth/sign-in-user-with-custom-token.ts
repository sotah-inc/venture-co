import firebase from "firebase";

import { IErrors } from "../../types/global";
import { resolveFirebaseApp } from "../app";

interface ISignInUserResult {
  errors: IErrors | null;
}

function resolveSignInUserErrors(error: firebase.FirebaseError): IErrors {
  switch (error.code) {
  case "auth/custom-token-mismatch":
    return { email: "Authentication token was wrong" };
  case "auth/invalid-custom-token":
    return { email: "Authentication token was invalid" };
  default:
    return { email: "Unknown error" };
  }
}

export async function signInUserWithCustomToken(
  browserApiKey: string,
  token: string,
): Promise<ISignInUserResult> {
  try {
    await resolveFirebaseApp(browserApiKey).auth().signInWithCustomToken(token);
  } catch (err) {
    return {
      errors: resolveSignInUserErrors(err),
    };
  }

  return {
    errors: null,
  };
}
