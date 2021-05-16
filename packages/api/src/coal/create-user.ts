import { ICreateUserRequest, IValidationErrorResponse } from "@sotah-inc/core";
import { resolveFirebaseAdminApp } from "@sotah-inc/server";
import firebaseAdmin from "firebase-admin";

interface ICreateUserResult {
  errors: IValidationErrorResponse | null;
  userData: {
    firebaseUid: string;
    token: string;
  } | null;
}

function resolveCreateUserErrors(error: firebaseAdmin.FirebaseError): IValidationErrorResponse {
  switch (error.code) {
  case "auth/email-already-exists":
    return { email: "Email is already in use" };
  case "auth/invalid-email":
    return { email: "Email address is not valid" };
  case "auth/operation-not-allowed":
    return { password: "Password authentication is not enabled" };
  case "auth/weak-password":
    return { password: "That password is not strong enough" };
  default:
    console.error("failed to register user", { error });

    return { email: "Unknown error" };
  }
}

export async function createUser(
  req: ICreateUserRequest,
): Promise<ICreateUserResult> {
  const auth = resolveFirebaseAdminApp()
    .auth();

  let res: firebaseAdmin.auth.UserRecord;
  try {
    res = await auth.createUser({ email: req.email,password: req.password });
  } catch (err) {
    return {
      userData: null,
      errors: resolveCreateUserErrors(err),
    };
  }

  return {
    userData: {
      token: await auth.createCustomToken(res.uid),
      firebaseUid: res.uid,
    },
    errors: null,
  };
}
