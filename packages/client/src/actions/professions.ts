import { IShortSkillTier, ProfessionId } from "@sotah-inc/core";

import { IGetProfessionsResult } from "../api/data";
import { ActionsUnion, createAction } from "./helpers";

export interface ILoadProfessionsEndpoint {
  loadId: string;
  professions: IGetProfessionsResult;
  selectedProfessionId?: ProfessionId;
  selectedSkillTier?: IShortSkillTier | null;
}

export const LOAD_PROFESSIONS_ENTRYPOINT = "LOAD_PROFESSIONS_ENTRYPOINT";
export const LoadProfessionsEntrypoint = (payload: ILoadProfessionsEndpoint) =>
  createAction(LOAD_PROFESSIONS_ENTRYPOINT, payload);

export const ProfessionsActions = {
  LoadProfessionsEntrypoint,
};

export type ProfessionsActions = ActionsUnion<typeof ProfessionsActions>;
