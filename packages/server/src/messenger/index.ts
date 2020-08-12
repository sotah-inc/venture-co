import {
  IConnectedRealmComposite,
  IConnectedRealmModificationDates,
  IRegionComposite,
  IRegionConnectedRealmTuple,
  IRegionRealmTuple,
  IRegionTuple,
  ItemId,
  ITokenHistory,
} from "@sotah-inc/core";
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
  IQueryAuctionStatsResponse,
  IQueryItemsRequest,
  IQueryItemsResponse,
  IRealmModificationDatesResponse,
  IValidateRegionConnectedRealmResponse,
  ValidateRegionRealmResponse,
} from "./contracts";
import { Message, ParseKind } from "./message";
import { MessageError } from "./message-error";

const DEFAULT_TIMEOUT = 5 * 1000;

export enum subjects {
  items = "items",
  itemsQuery = "itemsQuery",

  tokenHistory = "tokenHistory",

  status = "status",
  connectedRealms = "connectedRealms",
  validateRegionConnectedRealm = "validateRegionConnectedRealm",
  validateRegionRealm = "validateRegionRealm",
  queryRealmModificationDates = "queryRealmModificationDates",
  connectedRealmModificationDates = "connectedRealmModificationDates",

  boot = "boot",
  sessionSecret = "sessionSecret",

  auctions = "auctions",
  queryAuctionStats = "queryAuctionStats",
  priceList = "priceList",

  priceListHistory = "priceListHistory",
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

  // via items
  public async getItems(itemIds: ItemId[]): Promise<Message<IGetItemsResponse>> {
    return this.request(subjects.items, {
      body: JSON.stringify({ itemIds }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public queryItems(request: IQueryItemsRequest): Promise<Message<IQueryItemsResponse>> {
    return this.request(subjects.itemsQuery, { body: JSON.stringify(request) });
  }

  // via token-histories
  public getTokenHistory(tuple: IRegionTuple): Promise<Message<ITokenHistory>> {
    return this.request(subjects.tokenHistory, {
      body: JSON.stringify(tuple),
    });
  }

  // via regions
  public getStatus(tuple: IRegionTuple): Promise<Message<IRegionComposite>> {
    return this.request(subjects.status, {
      body: JSON.stringify(tuple),
    });
  }

  public getConnectedRealms(tuple: IRegionTuple): Promise<Message<IConnectedRealmComposite[]>> {
    return this.request(subjects.connectedRealms, {
      body: JSON.stringify(tuple),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public validateRegionConnectedRealm(
    tuple: IRegionConnectedRealmTuple,
  ): Promise<Message<IValidateRegionConnectedRealmResponse>> {
    return this.request(subjects.validateRegionConnectedRealm, {
      body: JSON.stringify(tuple),
    });
  }

  public validateRegionRealm(
    tuple: IRegionRealmTuple,
  ): Promise<Message<ValidateRegionRealmResponse>> {
    return this.request(subjects.validateRegionRealm, {
      body: JSON.stringify(tuple),
    });
  }

  public queryRealmModificationDates(
    tuple: IRegionConnectedRealmTuple,
  ): Promise<Message<IConnectedRealmModificationDates>> {
    return this.request(subjects.queryRealmModificationDates, { body: JSON.stringify(tuple) });
  }

  public getConnectedRealmModificationDates(): Promise<Message<IRealmModificationDatesResponse>> {
    return this.request(subjects.connectedRealmModificationDates);
  }

  // via boot
  public getBoot(): Promise<Message<IGetBootResponse>> {
    return this.request(subjects.boot);
  }

  public getSessionSecret(): Promise<Message<IGetSessionSecretResponse>> {
    return this.request(subjects.sessionSecret);
  }

  // via live-auctions
  public async getAuctions(request: IGetAuctionsRequest): Promise<Message<IGetAuctionsResponse>> {
    return this.request(subjects.auctions, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public queryAuctionStats(
    tuple: Partial<IRegionConnectedRealmTuple>,
  ): Promise<Message<IQueryAuctionStatsResponse>> {
    return this.request(subjects.queryAuctionStats, { body: JSON.stringify(tuple) });
  }

  public async getPriceList(
    request: IGetPricelistRequest,
  ): Promise<Message<IGetPricelistResponse>> {
    return this.request(subjects.priceList, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  // via pricelist-histories
  public async getPricelistHistories(
    req: IGetPricelistHistoriesRequest,
  ): Promise<Message<IGetPricelistHistoriesResponse>> {
    return this.request(subjects.priceListHistory, {
      body: JSON.stringify(req),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  // etc
  private request<T>(subject: string, opts?: IRequestOptions): Promise<Message<T>> {
    const { body, parseKind }: IDefaultRequestOptions = {
      body: "",
      parseKind: ParseKind.JsonEncoded,
      ...opts,
    };

    return new Promise<Message<T>>((resolve, reject) => {
      const tId = setTimeout(() => reject(new Error("Timed out!")), DEFAULT_TIMEOUT);

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
