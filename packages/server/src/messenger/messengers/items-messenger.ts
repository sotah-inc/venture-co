import { IQueryItem, IShortItem } from "@sotah-inc/core";

import {
  code,
  IGetItemClassesResponse,
  IGetItemsRequest,
  IGetItemsResponse,
  IQueryItemsRequest,
  IQueryItemsResponse,
} from "../contracts";
import { IItemsVendorPricesRequest, IItemsVendorPricesResponse } from "../contracts/professions";
import { Message, ParseKind } from "../message";
import { BaseMessenger } from "./base";

enum subjects {
  items = "items",
  itemsQuery = "itemsQuery",
  itemClasses = "itemClasses",
  itemsVendorPrices = "itemsVendorPrices",
}

export class ItemsMessenger extends BaseMessenger {
  public async items(request: IGetItemsRequest): Promise<Message<IGetItemsResponse>> {
    return this.request(subjects.items, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public itemsQuery(request: IQueryItemsRequest): Promise<Message<IQueryItemsResponse>> {
    return this.request(subjects.itemsQuery, { body: JSON.stringify(request) });
  }

  public async resolveQueryItems(
    request: IQueryItemsRequest,
  ): Promise<Array<IQueryItem<IShortItem>> | null> {
    // resolving items-query message
    const itemsQueryMessage = await this.itemsQuery(request);
    if (itemsQueryMessage.code !== code.ok) {
      return null;
    }

    const itemsQueryResult = await itemsQueryMessage.decode();
    if (itemsQueryResult === null) {
      return null;
    }

    // resolving items from item-ids in items-query response data
    const getItemsMessage = await this.items({
      itemIds: itemsQueryResult.items.map(v => v.item_id),
      locale: request.locale,
    });
    if (getItemsMessage.code !== code.ok) {
      return null;
    }

    const getItemsResult = await getItemsMessage.decode();
    if (getItemsResult === null) {
      return null;
    }

    return itemsQueryResult.items.map(v => {
      return {
        item: getItemsResult.items.find(foundItem => foundItem.id === v.item_id) ?? null,
        rank: v.rank,
        target: v.target,
      };
    });
  }

  public itemClasses(): Promise<Message<IGetItemClassesResponse>> {
    return this.request(subjects.itemClasses);
  }

  public itemsVendorPrices(
    request: IItemsVendorPricesRequest,
  ): Promise<Message<IItemsVendorPricesResponse>> {
    return this.request(subjects.itemsVendorPrices, { body: JSON.stringify(request) });
  }
}
