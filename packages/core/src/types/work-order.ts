import { ConnectedRealmId, GameVersion } from "./index";
import { ItemId } from "./item";
import { RegionName } from "./region";

export interface IWorkOrderJson {
  id: number;
  user_id: number;
  region_name: RegionName;
  connected_realm_id: ConnectedRealmId;
  item_id: ItemId;
  quantity: number;
  price: number;
  created_at: number;
  updated_at: number;
  game_version: GameVersion;
}

export enum OrderKind {
  CreatedAt = "createdAt",
}

export enum OrderDirection {
  Asc = "ASC",
  Desc = "DESC",
}
