import { IPriceListMap, IShortProfession, IShortRecipe, IShortSkillTier } from "@sotah-inc/core";

import { IFetchData, IItemsData, IPricelistHistoryState } from "./global";
import { FetchLevel } from "./main";

export interface ISelectedSkillTierCategory {
  index: number;
  isSelected: boolean;
}

export interface ISelectedSkillTier {
  data: IShortSkillTier | null;
  isSelected: boolean;
}

export interface IProfessionsState {
  loadId: string;
  professions: IFetchData<IShortProfession[]>;
  selectedProfession: IShortProfession | null;
  selectedSkillTier: ISelectedSkillTier;
  selectedRecipe: IItemsData<IShortRecipe> | null;
  selectedSkillTierCategory: ISelectedSkillTierCategory;
  pricelistHistory: IFetchData<IItemsData<IPricelistHistoryState>>;
  priceTable: IFetchData<IItemsData<IPriceListMap>>;
}

export const defaultProfessionsState: IProfessionsState = {
  loadId: "",
  priceTable: {
    data: {
      data: {},
      items: [],
    },
    errors: {},
    level: FetchLevel.initial,
  },
  pricelistHistory: {
    data: {
      data: {
        history: {},
        itemPriceLimits: {},
        overallPriceLimits: { lower: 0, upper: 0 },
      },
      items: [],
    },
    errors: {},
    level: FetchLevel.initial,
  },
  professions: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
  selectedProfession: null,
  selectedRecipe: null,
  selectedSkillTier: {
    data: null,
    isSelected: false,
  },
  selectedSkillTierCategory: {
    index: -1,
    isSelected: false,
  },
};
