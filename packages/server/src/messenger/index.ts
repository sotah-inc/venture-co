import { IStatus, ItemId, ITokenHistory, RegionName } from "@sotah-inc/core";
import * as nats from "nats";

import { gunzip } from "../util";
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
import { Message } from "./message";
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
  parseData?: boolean;
}

interface IDefaultRequestOptions {
  body: string;
  parseData: boolean;
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
    const message = await this.request<string>(subjects.auctions, {
      body: JSON.stringify(request),
      parseData: false,
    });
    if (message.code !== code.ok) {
      return { code: message.code, error: message.error };
    }

    return {
      code: code.ok,
      data: JSON.parse((await gunzip(Buffer.from(message.rawData!, "base64"))).toString()),
      error: null,
    };
  }

  public queryItems(query: string): Promise<Message<IQueryItemsResponse>> {
    return this.request(subjects.itemsQuery, { body: JSON.stringify({ query }) });
  }

  public async getPriceList(
    request: IGetPricelistRequest,
  ): Promise<Message<IGetPricelistResponse>> {
    const message = await this.request<string>(subjects.priceList, {
      body: JSON.stringify(request),
      parseData: false,
    });
    if (message.code !== code.ok) {
      return { code: message.code, error: message.error };
    }

    return {
      code: code.ok,
      data: JSON.parse((await gunzip(Buffer.from(message.rawData!, "base64"))).toString()),
      error: null,
    };
  }

  public async getItems(itemIds: ItemId[]): Promise<Message<IGetItemsResponse>> {
    const message = await this.request<string>(subjects.items, {
      body: JSON.stringify({ itemIds }),
      parseData: false,
    });
    if (message.code !== code.ok) {
      return { code: message.code, error: message.error };
    }

    return {
      code: code.ok,
      data: JSON.parse((await gunzip(Buffer.from(message.rawData!, "base64"))).toString()),
      error: null,
    };
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
    const message = await this.request<string>(subjects.priceListHistory, {
      body: JSON.stringify(req),
      parseData: false,
    });
    if (message.code !== code.ok) {
      return { code: message.code, error: message.error };
    }

    return {
      code: code.ok,
      data: JSON.parse((await gunzip(Buffer.from(message.rawData!, "base64"))).toString()),
      error: null,
    };
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

      const defaultOptions: IDefaultRequestOptions = {
        body: "",
        parseData: true,
      };
      let settings = defaultOptions;
      if (opts) {
        settings = {
          ...settings,
          ...opts,
        };
      }
      const { body, parseData } = settings;

      this.client.request(subject, body, (natsMsg: string) => {
        (async () => {
          clearTimeout(tId);
          const parsedMsg: IMessage = JSON.parse(natsMsg.toString());
          const msg = new Message<T>(parsedMsg, parseData);
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
