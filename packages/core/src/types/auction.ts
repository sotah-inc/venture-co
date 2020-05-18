import { ItemId } from "./item";
import { RealmSlug } from "./region";

export interface IAuctionRealm {
  name: string;
  slug: RealmSlug;
}

export type AuctionId = number;

export interface IAuction {
  itemId: ItemId;
  buyout: number;
  buyoutPer: number;
  quantity: number;
  timeLeft: string;
  aucList: AuctionId[];
}
