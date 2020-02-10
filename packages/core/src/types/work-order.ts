import { GameVersion } from "./index";
import { ItemId } from "./item";
import { RealmSlug, RegionName } from "./region";

export interface IWorkOrderJson {
  id: number;
  user_id: number;
  region_name: RegionName;
  realm_slug: RealmSlug;
  item_id: ItemId;
  quantity: number;
  price: number;
  created_at: number;
  updated_at: number;
  game_version: GameVersion;
}
