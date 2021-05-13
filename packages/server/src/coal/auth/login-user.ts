import { resolveFirebaseAdminApp } from "../admin";

export enum LoginUserCode {
  Ok,
  NotFound,
  Error
}

export interface ILoginUserResult {
  firebaseUid: string;
  code: LoginUserCode;
}

export async function loginUser(token: string): Promise<ILoginUserResult> {
  const auth = resolveFirebaseAdminApp().auth();

  const foundUser = await auth.verifyIdToken(token);

  return {
    code: LoginUserCode.Ok,
    firebaseUid: foundUser.uid,
  };
}
