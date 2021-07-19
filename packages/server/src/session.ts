import { BootMessenger, code } from "./messenger";

export interface IJwtOptions {
  audience: string;
  issuer: string;
  secret: string;
}

export async function getJwtOptions(mess: BootMessenger): Promise<IJwtOptions> {
  const msg = await mess.sessionSecret();
  if (msg.code !== code.ok) {
    throw new Error(msg.error?.message);
  }

  const sessionSecret: string | undefined = (await msg.decode())?.session_secret;
  if (sessionSecret === undefined) {
    throw new Error("session secret was undefined");
  }

  return {
    audience: "sotah-client",
    issuer: "sotah-api",
    secret: sessionSecret,
  };
}
