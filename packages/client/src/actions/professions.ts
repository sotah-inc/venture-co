import { ProfessionId } from "@sotah-inc/core";

import { IGetProfessionsResult, IGetSkillTierResult } from "../api/data";
import { ActionsUnion, createAction } from "./helpers";

export interface ILoadProfessionsEndpoint {
  loadId: string;
  professions: IGetProfessionsResult;
  selectedProfessionId?: ProfessionId;
  skillTier?: IGetSkillTierResult;
}

export const LOAD_PROFESSIONS_ENTRYPOINT = "LOAD_PROFESSIONS_ENTRYPOINT";
export const LoadProfessionsEntrypoint = (payload: ILoadProfessionsEndpoint) =>
  createAction(LOAD_PROFESSIONS_ENTRYPOINT, payload);

export const ProfessionsActions = {
  LoadProfessionsEntrypoint,
};

export type ProfessionsActions = ActionsUnion<typeof ProfessionsActions>;
