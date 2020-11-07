import { IShortItem, IShortPet, Locale } from "@sotah-inc/core";

export interface IQueryGeneralRequest {
  query: string;
  locale: Locale;
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
