import { Locale } from "@sotah-inc/core";
import { NatsConnection } from "nats";

import {
  code,
  IGetAuctionsRequest,
  IGetAuctionsResponse,
  IGetPricelistRequest,
  IGetPricelistResponse,
  ResolveAuctionsResponse,
} from "../contracts";
import { Message, ParseKind } from "../message";
import { BaseMessenger } from "./base";
import { ItemsMessenger } from "./items-messenger";
import { PetsMessenger } from "./pets-messenger";

enum subjects {
  auctions = "auctions",
  priceList = "priceList",
}

export class LiveAuctionsMessenger extends BaseMessenger {
  private itemsMessenger: ItemsMessenger;

  private petsMessenger: PetsMessenger;

  constructor(conn: NatsConnection, itemsMessenger: ItemsMessenger, petsMessenger: PetsMessenger) {
    super(conn);

    this.itemsMessenger = itemsMessenger;
    this.petsMessenger = petsMessenger;
  }

  public async auctions(request: IGetAuctionsRequest): Promise<Message<IGetAuctionsResponse>> {
    return this.request(subjects.auctions, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async priceList(request: IGetPricelistRequest): Promise<Message<IGetPricelistResponse>> {
    return this.request(subjects.priceList, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async resolveAuctions(
    request: IGetAuctionsRequest,
    locale: Locale,
  ): Promise<ResolveAuctionsResponse> {
    const auctionsMessage = await this.auctions(request);
    if (auctionsMessage.code !== code.ok) {
      return {
        code: auctionsMessage.code,
        data: null,
        error: auctionsMessage.error?.message ?? null,
      };
    }

    const auctionsResult = await auctionsMessage.decode();
    if (auctionsResult === null) {
      return {
        code: code.msgJsonParseError,
        data: null,
        error: "failed to decode auctions-message",
      };
    }

    const itemIds = [...Array.from(new Set(auctionsResult.auctions.map(v => v.itemId)))];
    const petIds = [...Array.from(new Set(auctionsResult.auctions.map(v => v.pet_species_id)))];
    const [itemsMsg, petsMsg] = await Promise.all([
      this.itemsMessenger.getItems({
        itemIds,
        locale,
      }),
      this.petsMessenger.getPets({
        locale,
        petIds,
      }),
    ]);
    if (itemsMsg.code !== code.ok) {
      return {
        code: itemsMsg.code,
        data: null,
        error: itemsMsg.error?.message ?? null,
      };
    }

    const itemsResult = await itemsMsg.decode();
    if (itemsResult === null) {
      return {
        code: code.msgJsonParseError,
        data: null,
        error: "failed to decode items-message",
      };
    }

    if (petsMsg.code !== code.ok) {
      return {
        code: petsMsg.code,
        data: null,
        error: petsMsg.error?.message ?? null,
      };
    }

    const petsResult = await petsMsg.decode();
    if (petsResult === null) {
      return {
        code: code.msgJsonParseError,
        data: null,
        error: "failed to decode pets-message",
      };
    }

    return {
      code: code.ok,
      data: {
        auctions: auctionsResult,
        items: itemsResult,
        pets: petsResult,
      },
      error: null,
    };
  }
}
