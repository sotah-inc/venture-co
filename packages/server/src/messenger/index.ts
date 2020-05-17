import { IStatus, ItemId, ITokenHistory, RegionName } from "@sotah-inc/core";
import * as nats from "nats";

import {
  IGetAuctionsRequest,
  IGetAuctionsResponse,
  IGetBootResponse,
  IGetItemsResponse,
  IGetPricelistHistoriesRequest,
  IGetPricelistHistoriesResponse,
  IGetPricelistRequest,
  IGetPricelistResponse,
  IGetSessionSecretResponse,
  IQueryAuctionStatsRequest,
  IQueryAuctionStatsResponse,
  IQueryItemsResponse,
  IQueryRealmModificationDatesRequest,
  IQueryRealmModificationDatesResponse,
  IRealmModificationDatesResponse,
  IValidateRegionRealmRequest,
  IValidateRegionRealmResponse,
} from "./contracts";
import { Message, ParseKind } from "./message";
import { MessageError } from "./message-error";

const DEFAULT_TIMEOUT = 5 * 1000;

export enum subjects {
  status = "status",
  genericTestErrors = "genericTestErrors",
  auctions = "auctions",
  itemsQuery = "itemsQuery",
  auctionsQuery = "auctionsQuery",
  priceList = "priceList",
  priceListHistory = "priceListHistory",
  items = "items",
  boot = "boot",
  sessionSecret = "sessionSecret",
  queryRealmModificationDates = "queryRealmModificationDates",
  realmModificationDates = "realmModificationDates",
  tokenHistory = "tokenHistory",
  queryAuctionStats = "queryAuctionStats",
  validateRegionRealm = "validateRegionRealm",
}

export enum code {
  ok = 1,
  genericError = -1,
  msgJsonParseError = -2,
  notFound = -3,
  userError = -4,
}

export interface IMessage {
  data: string;
  error: string;
  code: number;
}

interface IRequestOptions {
  body?: string;
  parseKind?: ParseKind;
}

interface IDefaultRequestOptions {
  body: string;
  parseKind: ParseKind;
}

export class Messenger {
  private client: nats.Client;

  constructor(client: nats.Client) {
    this.client = client;
  }

  public getTokenHistory(regionName: RegionName): Promise<Message<ITokenHistory>> {
    return this.request(subjects.tokenHistory, {
      body: JSON.stringify({ region_name: regionName }),
    });
  }

  public getStatus(regionNameValue: RegionName): Promise<Message<IStatus>> {
    return this.request(subjects.status, {
      body: JSON.stringify({ region_name: regionNameValue }),
    });
  }

  public validateRegionConnectedRealm(
    req: IValidateRegionRealmRequest,
  ): Promise<Message<IValidateRegionRealmResponse>> {
    return this.request(subjects.validateRegionRealm, {
      body: JSON.stringify(req),
    });
  }

  public async getAuctions(request: IGetAuctionsRequest): Promise<Message<IGetAuctionsResponse>> {
    return this.request(subjects.auctions, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public queryItems(query: string): Promise<Message<IQueryItemsResponse>> {
    return this.request(subjects.itemsQuery, { body: JSON.stringify({ query }) });
  }

  public async getPriceList(
    request: IGetPricelistRequest,
  ): Promise<Message<IGetPricelistResponse>> {
    return this.request(subjects.priceList, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async getItems(itemIds: ItemId[]): Promise<Message<IGetItemsResponse>> {
    return this.request(subjects.items, {
      body: JSON.stringify({ itemIds }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public getBoot(): Promise<Message<IGetBootResponse>> {
    return this.request(subjects.boot);
  }

  public getRealmModificationDates(): Promise<Message<IRealmModificationDatesResponse | null>> {
    return this.request(subjects.realmModificationDates);
  }

  public async getPricelistHistories(
    req: IGetPricelistHistoriesRequest,
  ): Promise<Message<IGetPricelistHistoriesResponse>> {
    return this.request(subjects.priceListHistory, {
      body: JSON.stringify(req),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public getSessionSecret(): Promise<Message<IGetSessionSecretResponse>> {
    return this.request(subjects.sessionSecret);
  }

  public queryRealmModificationDates(
    req: IQueryRealmModificationDatesRequest,
  ): Promise<Message<IQueryRealmModificationDatesResponse>> {
    return this.request(subjects.queryRealmModificationDates, { body: JSON.stringify(req) });
  }

  public queryAuctionStats(
    req: IQueryAuctionStatsRequest,
  ): Promise<Message<IQueryAuctionStatsResponse>> {
    return this.request(subjects.queryAuctionStats, { body: JSON.stringify(req) });
  }

  public request<T>(subject: string, opts?: IRequestOptions): Promise<Message<T>> {
    return new Promise<Message<T>>((resolve, reject) => {
      const tId = setTimeout(() => reject(new Error("Timed out!")), DEFAULT_TIMEOUT);

      const { body, parseKind }: IDefaultRequestOptions = {
        body: "",
        parseKind: ParseKind.None,
        ...opts,
      };

      this.client.request(subject, body, (natsMsg: string) => {
        (async () => {
          clearTimeout(tId);
          const parsedMsg: IMessage = JSON.parse(natsMsg.toString());
          const msg = new Message<T>(parsedMsg, parseKind);
          if (msg.error !== null && msg.code === code.genericError) {
            const reason: MessageError = {
              code: msg.code,
              message: msg.error.message,
            };
            reject(reason);

            return;
          }

          resolve(msg);
        })();
      });
    });
  }
}
