import firebase from "firebase";

import { IErrors } from "../../types/global";
import { resolveFirebaseApp } from "../app";

interface IRegisterUserRequest {
  email: string;
  password: string;
}

interface IRegisterUserResult {
  errors: IErrors | null;
  userId: string | null;
}

function resolveRegisterUserErrors(error: firebase.FirebaseError): IErrors {
  switch (error.code) {
  case "auth/email-already-in-use":
    return { email: "Email is already in use" };
  case "auth/invalid-email":
    return { email: "Email address is not valid" };
  case "auth/operation-not-allowed":
    return { password: "Password authentication is not enabled" };
  case "auth/weak-password":
    return { password: "That password is not strong enough" };
  default:
    return { email: "Unknown error" };
  }
}

export async function registerUser(
  browserApiKey: string,
  req: IRegisterUserRequest,
): Promise<IRegisterUserResult> {
  let res: firebase.auth.UserCredential;

  try {
    res = await resolveFirebaseApp(browserApiKey)
      .auth()
      .createUserWithEmailAndPassword(req.email, req.password);
  } catch (err) {
    return {
      userId: null,
      errors: resolveRegisterUserErrors(err),
    };
  }

  return {
    userId: res.user?.uid ?? null,
    errors: null,
  };
}
