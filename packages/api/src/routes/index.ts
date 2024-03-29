import { IMessengers } from "@sotah-inc/server";
import { Express } from "express";
import { Connection } from "typeorm";

import { mount as mountPrivate } from "./private";
import { mount as mountPublic } from "./public";

export enum AppKind {
  Private = "private",
  Public = "public",
}

export interface IMountOptions {
  kind: string;
  app: Express;
  dbConn: Connection;
  messengers: IMessengers;
  clientHost: string;
}

export function mount({ app, dbConn, messengers, kind, clientHost }: IMountOptions): void {
  switch (kind) {
  case AppKind.Public:
    mountPublic({ app, dbConn, messengers, clientHost });

    break;
  case AppKind.Private:
    mountPrivate(app, dbConn, clientHost);

    break;
  default:
    break;
  }
}
