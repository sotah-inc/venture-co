import { IRegionVersionConnectedRealmTuple } from "@sotah-inc/core";
import { NatsConnection } from "nats";

import { IQueryAuctionStatsResponse } from "../contracts";
import { Message } from "../message";
import { BaseMessenger } from "./base";

enum subjects {
  queryAuctionStats = "queryAuctionStats",
}

export class StatsMessenger extends BaseMessenger {
  constructor(conn: NatsConnection) {
    super(conn);
  }

  public queryAuctionStats(
    tuple: IRegionVersionConnectedRealmTuple,
  ): Promise<Message<IQueryAuctionStatsResponse>> {
    return this.request(subjects.queryAuctionStats, {
      body: JSON.stringify(tuple),
    });
  }
}
