import { IShortPet, PetQuality } from "@sotah-inc/core";

interface PetQualityColorClassMap {
  [key: number]: string | undefined;
}

const petQualityColorClassMap: PetQualityColorClassMap = {
  [PetQuality.Uncommon]: "uncommon-text",
  [PetQuality.Rare]: "rare-text",
  [PetQuality.Epic]: "epic-text",
};

export function petQualityToColorClass(quality: PetQuality): string {
  return petQualityColorClassMap[quality] ?? "uncommon-text";
}

export const getPetIconUrl = (pet: IShortPet): string => {
  return pet.icon_url;
};
