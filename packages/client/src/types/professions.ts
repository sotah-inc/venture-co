import {
  IItemPrices,
  IRecipePriceHistories,
  IShortProfession,
  IShortRecipe,
  IShortSkillTier,
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

export interface IProfessionsState {
  loadId: string;
  professions: IFetchData<IShortProfession[]>;
  selectedProfessionId: ProfessionId;
  selectedProfession: IShortProfession | null | undefined;
  selectedSkillTier: ISelectedSkillTier;
  selectedRecipeId: RecipeId;
  selectedRecipe: IItemsData<IShortRecipe> | null | undefined;
  selectedSkillTierCategory: ISelectedSkillTierCategory;
  recipePriceHistories: IFetchData<IRecipePriceHistories>;
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
    data: {},
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
