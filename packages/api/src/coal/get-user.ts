import { IValidationErrorResponse } from "@sotah-inc/core";
import { resolveFirebaseAdminApp } from "@sotah-inc/server";
import firebaseAdmin from "firebase-admin";

interface IGetUserResult {
  errors: IValidationErrorResponse | null;
  user: firebaseAdmin.auth.UserRecord | null;
}

function resolveGetUserErrors(error: firebaseAdmin.FirebaseError): IValidationErrorResponse {
  switch (error.code) {
  default:
    console.error("failed to get user", { error });

    return { email: "Unknown error" };
  }
}

export async function getUser(firebaseUid: string): Promise<IGetUserResult> {
  const auth = resolveFirebaseAdminApp().auth();

  let user: firebaseAdmin.auth.UserRecord;
  try {
    user = await auth.getUser(firebaseUid);
  } catch (err) {
    return {
      user: null,
      errors: resolveGetUserErrors(err),
    };
  }

  return {
    user,
    errors: null,
  };
}
