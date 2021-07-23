import { GameVersion, IShortItem, ItemId, Locale } from "@sotah-inc/core";

export interface IQueryItemsRequest {
  query: string;
  game_version: GameVersion;
  locale: Locale;
}

export interface IQueryItemsResponse {
  items: Array<{
    item_id: ItemId;
    target: string;
    rank: number;
  }>;
}

export interface IQueryItemsResponse {
  items: Array<{
    item_id: ItemId;
    target: string;
    rank: number;
  }>;
}

export interface IGetItemsRequest {
  itemIds: ItemId[];
  locale: Locale;
  game_version: GameVersion;
}

export interface IGetItemsResponse {
  items: IShortItem[];
}
