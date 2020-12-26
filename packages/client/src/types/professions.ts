import {
  IItemPrices,
  IPriceLimits,
  IRecipePriceHistories,
  IShortProfession,
  IShortRecipe,
  IShortSkillTier,
  ItemId,
  ProfessionId,
  RecipeId,
} from "@sotah-inc/core";

import { IFetchData, IItemsData } from "./global";
import { FetchLevel } from "./main";

export interface ISelectedSkillTierCategory {
  index: number;
  isSelected: boolean;
}

export interface ISelectedSkillTier {
  data: IShortSkillTier | null;
  isSelected: boolean;
}

export interface IRecipePriceHistoriesState {
  histories: IRecipePriceHistories;
  overallPriceLimits: IPriceLimits;
  recipeItemIds: { [key: number]: ItemId[] };
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
  recipePriceHistories: IFetchData<IRecipePriceHistoriesState>;
  priceTable: IFetchData<IItemsData<IItemPrices>>;
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
  professions: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
  recipePriceHistories: {
    data: {
      histories: {},
      overallPriceLimits: {
        lower: 0,
        upper: 0,
      },
      recipeItemIds: [],
    },
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
