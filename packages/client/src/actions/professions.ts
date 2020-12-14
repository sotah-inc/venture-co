import {
  IGetItemPriceHistoriesResponseData,
  IGetPricelistResponseData,
  ProfessionId,
  RecipeId,
} from "@sotah-inc/core";

import { IGetProfessionsResult, IGetRecipeResult, IGetSkillTierResult } from "../api/professions";
import { ActionsUnion, createAction } from "./helpers";

export interface ILoadProfessionsEndpoint {
  loadId: string;
  professions: IGetProfessionsResult;
  selectedProfessionId?: ProfessionId;
  skillTier?: IGetSkillTierResult;
  recipe?: IGetRecipeResult;
  selectedRecipeId?: RecipeId;
  pricelistHistory?: IGetItemPriceHistoriesResponseData | null;
  currentPrices?: IGetPricelistResponseData | null;
}

export const LOAD_PROFESSIONS_ENTRYPOINT = "LOAD_PROFESSIONS_ENTRYPOINT";
export const LoadProfessionsEntrypoint = (payload: ILoadProfessionsEndpoint) =>
  createAction(LOAD_PROFESSIONS_ENTRYPOINT, payload);

export const SELECT_SKILLTIER_CATEGORY = "SELECT_SKILLTIER_CATEGORY";
export const SelectSkillTierCategory = (payload: number) =>
  createAction(SELECT_SKILLTIER_CATEGORY, payload);

export const DESELECT_SKILLTIER_CATEGORY = "DESELECT_SKILLTIER_CATEGORY";
export const DeselectSkillTierCategory = () => createAction(DESELECT_SKILLTIER_CATEGORY);

export const SELECT_SKILLTIER_FLAG = "SELECT_SKILLTIER_FLAG";
export const SelectSkillTierFlag = () => createAction(SELECT_SKILLTIER_FLAG);

export const DESELECT_SKILLTIER_FLAG = "DESELECT_SKILLTIER_FLAG";
export const DeselectSkillTierFlag = () => createAction(DESELECT_SKILLTIER_FLAG);

export const ProfessionsActions = {
  DeselectSkillTierCategory,
  DeselectSkillTierFlag,
  LoadProfessionsEntrypoint,
  SelectSkillTierCategory,
  SelectSkillTierFlag,
};

export type ProfessionsActions = ActionsUnion<typeof ProfessionsActions>;
