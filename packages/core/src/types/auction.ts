import { ItemId } from "./item";
import { RealmSlug } from "./region";

export interface IAuctionRealm {
  name: string;
  slug: RealmSlug;
}

export interface IAuction {
  itemId: ItemId;
  ownerRealm: string;
  bid: number;
  buyout: number;
  buyoutPer: number;
  quantity: number;
  timeLeft: string;
  aucList: number[];
}
