import {
  IItemPrices,
  IShortProfession,
  IShortRecipe,
  IShortSkillTier,
  ProfessionId,
  RecipeId,
} from "@sotah-inc/core";

import { IFetchData, IItemPriceHistoriesState, IItemsData } from "./global";
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
  selectedProfessionId: ProfessionId;
  selectedProfession: IShortProfession | null | undefined;
  selectedSkillTier: ISelectedSkillTier;
  selectedRecipeId: RecipeId;
  selectedRecipe: IItemsData<IShortRecipe> | null | undefined;
  selectedSkillTierCategory: ISelectedSkillTierCategory;
  itemPriceHistories: IFetchData<IItemsData<IItemPriceHistoriesState>>;
  priceTable: IFetchData<IItemsData<IItemPrices>>;
}

export const defaultProfessionsState: IProfessionsState = {
  itemPriceHistories: {
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
  loadId: "",
  priceTable: {
    data: {
      data: {},
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
  selectedProfession: undefined,
  selectedProfessionId: 0,
  selectedRecipe: null,
  selectedRecipeId: 0,
  selectedSkillTier: {
    data: null,
    isSelected: false,
  },
  selectedSkillTierCategory: {
    index: -1,
    isSelected: false,
  },
};
