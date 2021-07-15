import { IRegionTokenHistory, IRegionTuple } from "@sotah-inc/core";
import { NatsConnection } from "nats";

import { IShortTokenHistoryResponse } from "../contracts/tokens";
import { Message, ParseKind } from "../message";
import { BaseMessenger } from "./base";

enum subjects {
  regionTokenHistory = "regionTokenHistory",
  tokenHistory = "tokenHistory",
}

export class TokensMessenger extends BaseMessenger {
  constructor(conn: NatsConnection) {
    super(conn);
  }

  public getRegionTokenHistory(tuple: IRegionTuple): Promise<Message<IRegionTokenHistory>> {
    return this.request(subjects.regionTokenHistory, {
      body: JSON.stringify(tuple),
    });
  }

  public getTokenHistory(): Promise<Message<IShortTokenHistoryResponse>> {
    return this.request(subjects.tokenHistory, {
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }
}
