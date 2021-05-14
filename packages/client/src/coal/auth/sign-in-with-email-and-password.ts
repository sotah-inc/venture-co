import firebase from "firebase";

import { IErrors } from "../../types/global";
import { resolveFirebaseApp } from "../app";

export interface ISignInWithEmailAndPasswordRequest {
  email: string;
  password: string;
}

interface ISignInWithEmailAndPasswordResult {
  errors: IErrors | null;
  token: string | null;
}

function resolveSignInWithEmailAndPasswordErrors(error: firebase.FirebaseError): IErrors {
  switch (error.code) {
  case "auth/invalid-email":
    return { email: "Email is invalid" };
  case "auth/user-disabled":
    return { email: "User is disabled" };
  case "auth/user-not-found":
    return { email: "User not found" };
  case "auth/wrong-password":
    return { password: "Invalid password" };
  default:
    return { email: "Unknown error" };
  }
}

export async function signInWithEmailAndPassword(
  browserApiKey: string,
  req: ISignInWithEmailAndPasswordRequest,
): Promise<ISignInWithEmailAndPasswordResult> {
  try {
    await resolveFirebaseApp(browserApiKey)
      .auth()
      .signInWithEmailAndPassword(req.email, req.password);
  } catch (err) {
    return {
      errors: resolveSignInWithEmailAndPasswordErrors(err),
      token: null,
    };
  }

  return {
    errors: null,
    token: "",
  };
}
