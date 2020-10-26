export type PetId = number;

export enum PetQuality {
  Uncommon = 1,
  Rare = 2,
  Epic = 3,
}

export interface IShortPet {
  id: PetId;
  name: string;
  icon_url: string;
  description: string;
  type: string;
  type_name: string;
}
