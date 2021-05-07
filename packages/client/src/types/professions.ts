import {
  IItemPriceHistories,
  IItemPrices,
  IItemsVendorPricesResponse,
  IPricesFlagged,
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
  recipeData: {
    histories: IRecipePriceHistories;
    recipeItemIds: { [key: string]: ItemId[] };
  };
  itemData: {
    history: IItemPriceHistories<IPricesFlagged>;
  };
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
  itemVendorPrices: IFetchData<IItemsVendorPricesResponse>;
}

export const defaultProfessionsState: IProfessionsState = {
  loadId: "",
  itemVendorPrices: {
    data: {
      vendor_prices: {},
    },
    level: FetchLevel.initial,
    errors: {},
  },
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
      itemData: {
        history: {},
      },
      recipeData: {
        histories: {},
        recipeItemIds: {},
      },
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
