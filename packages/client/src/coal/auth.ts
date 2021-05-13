import firebase from "firebase/app";
import "firebase/auth";

let app: firebase.app.App;

function resolveApp(browserApiKey: string): firebase.app.App {
  if (app) {
    return app;
  }

  app =  firebase.initializeApp({
    apiKey: browserApiKey,
  });

  return app;
}

interface IRegisterUserRequest {
  email: string;
  password: string;
}

export async function registerUser(
  browserApiKey: string,
  req: IRegisterUserRequest,
): Promise<string | null> {
  const res = await resolveApp(browserApiKey)
    .auth()
    .createUserWithEmailAndPassword(req.email, req.password);

  return res.user?.uid ?? null;
}
