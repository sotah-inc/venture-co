import { Express, NextFunction, Request, Response } from "express";
import passport from "passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { Connection } from "typeorm";

import { User } from "./db";
import { code, GeneralMessenger } from "./messenger";

export interface IJwtOptions {
  audience: string;
  issuer: string;
  secret: string;
}

export async function getJwtOptions(generalMessenger: GeneralMessenger): Promise<IJwtOptions> {
  const msg = await generalMessenger.getSessionSecret();
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

export interface IJwtPayload {
  data: string;
}

export async function appendSessions(
  app: Express,
  messenger: GeneralMessenger,
  conn: Connection,
): Promise<Express> {
  const jwtOptions = await getJwtOptions(messenger);

  const opts: StrategyOptions = {
    algorithms: ["HS512"],
    audience: jwtOptions.audience,
    issuer: jwtOptions.issuer,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtOptions.secret,
  };
  passport.use(
    new Strategy(opts, (jwtPayload: IJwtPayload, done) => {
      (async () => {
        const user = await conn.getRepository(User).findOne(jwtPayload.data);
        if (user === null) {
          done(null, false);
        }

        done(null, user);
      })();
    }),
  );

  app.use(passport.initialize());

  return app;
}

export function auth(req: Request, res: Response, next: NextFunction): unknown {
  return passport.authenticate("jwt", { session: false })(req, res, next);
}
