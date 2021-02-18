import { IShortPet, PetQuality } from "@sotah-inc/core";

interface IPetQualityColorClassMap {
  [key: number]: string | undefined;
}

const petQualityColorClassMap: IPetQualityColorClassMap = {
  [PetQuality.Uncommon]: "uncommon-text",
  [PetQuality.Rare]: "rare-text",
  [PetQuality.Epic]: "epic-text",
};

export function petQualityToColorClass(quality: PetQuality): string {
  return petQualityColorClassMap[quality] ?? "uncommon-text";
}

export function getPetIconUrl(pet: IShortPet): string {
  return pet.icon_url;
}
