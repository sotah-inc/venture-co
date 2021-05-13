import { ExpansionName } from "./expansion";
import { ItemId } from "./item";
import { ProfessionId } from "./short-profession";

export interface IPreferenceJson {
  id: number;
  current_region: string | null;
  current_realm: string | null;
}

export interface IPricelistEntryJson {
  id: number;
  item_id: ItemId;
  quantity_modifier: number;
}

export interface IPricelistJson {
  id: number;
  name: string;
  slug: string | null;
  pricelist_entries: IPricelistEntryJson[];
}

export interface IProfessionPricelistJson {
  id: number;
  professionId: ProfessionId;
  expansion: ExpansionName;
  pricelist: IPricelistJson;
}

export enum UserLevel {
  Admin = 60,
  Regular = 10,
  Unverified = 5,
}

export interface IUserJson {
  id: string;
  level: UserLevel;
  firebaseUid: string;
}

export interface IPostJson {
  id: number;
  title: string;
  slug: string;
  body: string;
  summary: string;
  createdAt: number;
}
