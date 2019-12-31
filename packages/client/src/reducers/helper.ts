import { IPricelistJson, IProfessionPricelistJson } from "@sotah-inc/core";

export const getPricelistIndex = (pricelists: IPricelistJson[], id: number): number => {
  for (let i = 0; i < pricelists.length; i++) {
    const pricelist = pricelists[i];
    if (pricelist.id === id) {
      return i;
    }
  }

  return -1;
};

export const getProfessionPricelistIndex = (
  professionPricelists: IProfessionPricelistJson[],
  id: number,
): number => {
  for (let i = 0; i < professionPricelists.length; i++) {
    const professionPricelist = professionPricelists[i];
    if (professionPricelist.pricelist.id === id) {
      return i;
    }
  }

  return -1;
};
