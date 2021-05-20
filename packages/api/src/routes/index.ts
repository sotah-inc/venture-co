import { IMessengers } from "@sotah-inc/server";
import { Express } from "express";
import { Connection } from "typeorm";

import { mount as mountPrivate } from "./private";
import { mount as mountPublic } from "./public";

export enum AppKind {
  Private = "private",
  Public = "public",
}

export function mount(
  kind: string,
  app: Express,
  dbConn: Connection,
  messengers: IMessengers,
): void {
  switch (kind) {
  case AppKind.Public:
    mountPublic(app, dbConn, messengers);

    break;
  case AppKind.Private:
    mountPrivate(app, dbConn);

    break;
  default:
    break;
  }
}
