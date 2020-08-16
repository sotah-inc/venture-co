import { ItemId } from "./item";

export type AuctionId = number;

export interface IAuction {
  itemId: ItemId;
  buyout: number;
  buyoutPer: number;
  quantity: number;
  timeLeft: string;
  aucList: AuctionId[];
}
