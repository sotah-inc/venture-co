import { IValidationErrorResponse } from "@sotah-inc/core";
import firebaseAdmin from "firebase-admin";

import { resolveFirebaseAdminApp } from "../admin";

export enum VerifyIdTokenCode {
  Ok,
  Error,
  Expired
}

export interface IVerifyIdTokenResult {
  firebaseUid: string | null;
  code: VerifyIdTokenCode;
  errors: IValidationErrorResponse | null;
}

function resolveVerifyIdTokenErrors(error: firebaseAdmin.FirebaseError): IValidationErrorResponse {
  switch (error.code) {
  case "auth/argument-error":
    return { token: "Token was invalid" };
  case "auth/id-token-expired":
    return { token: "Token was expired" };
  default:
    return { token: "Unknown error" };
  }
}

const FirebaseErrorCodeMap: { [key: string]: VerifyIdTokenCode | undefined } = {
  "auth/id-token-expired": VerifyIdTokenCode.Expired,
};

export async function verifyIdToken(token: string): Promise<IVerifyIdTokenResult> {
  const auth = resolveFirebaseAdminApp().auth();

  let decodedToken: firebaseAdmin.auth.DecodedIdToken;
  try {
    decodedToken = await auth.verifyIdToken(token);
  } catch (err) {
    console.error("failed to verify id-token", { err, token });

    return {
      code: FirebaseErrorCodeMap[err.code] ?? VerifyIdTokenCode.Error,
      firebaseUid: null,
      errors: resolveVerifyIdTokenErrors(err),
    };
  }

  // eslint-disable-next-line no-console
  console.log("received token", { decodedToken });

  return {
    code: VerifyIdTokenCode.Ok,
    firebaseUid: decodedToken.uid,
    errors: null,
  };
}
