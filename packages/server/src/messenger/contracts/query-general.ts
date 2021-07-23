import { GameVersion, IShortItem, IShortPet, Locale } from "@sotah-inc/core";

export interface IQueryGeneralRequest {
  query: string;
  locale: Locale;
  game_version: GameVersion;
}

export interface IQueryGeneralItemItem {
  item: IShortItem | null;
  pet: IShortPet | null;
}

export interface IQueryGeneralItem {
  item: IQueryGeneralItemItem;
  target: string;
  rank: number;
}
