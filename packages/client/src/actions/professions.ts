import { ProfessionId } from "@sotah-inc/core";

import { IGetProfessionsResult, IGetRecipeResult, IGetSkillTierResult } from "../api/data";
import { ActionsUnion, createAction } from "./helpers";

export interface ILoadProfessionsEndpoint {
  loadId: string;
  professions: IGetProfessionsResult;
  selectedProfessionId?: ProfessionId;
  skillTier?: IGetSkillTierResult;
  recipe?: IGetRecipeResult;
}

export const LOAD_PROFESSIONS_ENTRYPOINT = "LOAD_PROFESSIONS_ENTRYPOINT";
export const LoadProfessionsEntrypoint = (payload: ILoadProfessionsEndpoint) =>
  createAction(LOAD_PROFESSIONS_ENTRYPOINT, payload);

export const SET_SKILLTIERCATEGORY_INDEX = "SET_SKILLTIERCATEGORY_INDEX";
export const SetSkillTierCategoryIndex = (payload: number) =>
  createAction(SET_SKILLTIERCATEGORY_INDEX, payload);

export const ProfessionsActions = {
  LoadProfessionsEntrypoint,
  SetSkillSetCategoryIndex: SetSkillTierCategoryIndex,
};

export type ProfessionsActions = ActionsUnion<typeof ProfessionsActions>;
