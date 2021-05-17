import { IValidationErrorResponse } from "@sotah-inc/core";
import { resolveFirebaseAdminApp } from "@sotah-inc/server";
import firebaseAdmin from "firebase-admin";

interface IGenerateEmailVerificationLinkResult {
  errors: IValidationErrorResponse | null;
  destination: string | null;
}

function resolveGenerateEmailVerificationLinkErrors(
  error: firebaseAdmin.FirebaseError,
): IValidationErrorResponse {
  switch (error.code) {
  default:
    console.error("failed to generate email-verification link", { error });

    return { email: "Unknown error" };
  }
}

export async function generateEmailVerificationLink(
  email: string,
): Promise<IGenerateEmailVerificationLinkResult> {
  const auth = resolveFirebaseAdminApp().auth();

  let dest: string;
  try {
    dest = await auth.generateEmailVerificationLink(email, {
      url: "http://localhost:3000/user/verified",
    });
  } catch (err) {
    return {
      destination: null,
      errors: resolveGenerateEmailVerificationLinkErrors(err),
    };
  }

  return {
    destination: dest,
    errors: null,
  };
}
