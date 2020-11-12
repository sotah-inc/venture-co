import { IShortProfession, IShortRecipe, IShortSkillTier } from "@sotah-inc/core";

import { IFetchData, IItemsData } from "./global";
import { FetchLevel } from "./main";

export interface IProfessionsState {
  loadId: string;
  professions: IFetchData<IShortProfession[]>;
  selectedProfession: IShortProfession | null;
  selectedSkillTier: IShortSkillTier | null;
  selectedRecipe: IItemsData<IShortRecipe> | null;
  selectedSkillTierCategoryIndex: number;
}

export const defaultProfessionsState: IProfessionsState = {
  loadId: "",
  professions: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
  selectedProfession: null,
  selectedRecipe: null,
  selectedSkillTier: null,
  selectedSkillTierCategoryIndex: -1,
};
