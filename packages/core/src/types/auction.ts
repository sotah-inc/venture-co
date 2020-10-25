import { ItemId } from "./item";
import { PetId, PetQuality } from "./short-pet";

export type AuctionId = number;

export interface IAuction {
  itemId: ItemId;
  pet_species_id: PetId;
  pet_quality_id: PetQuality;
  buyout: number;
  buyoutPer: number;
  quantity: number;
  timeLeft: string;
  aucList: AuctionId[];
}
