import { IShortProfession } from "@sotah-inc/core";

import { ActionsUnion, createAction } from "./helpers";

export interface ILoadProfessionsEndpoint {
  loadId: string;
  professions: IShortProfession[] | null;
}

export const LOAD_PROFESSIONS_ENTRYPOINT = "LOAD_PROFESSIONS_ENTRYPOINT";
export const LoadProfessionsEntrypoint = (payload: ILoadProfessionsEndpoint) =>
  createAction(LOAD_PROFESSIONS_ENTRYPOINT, payload);

export const ProfessionsActions = {
  LoadProfessionsEntrypoint,
};

export type ProfessionsActions = ActionsUnion<typeof ProfessionsActions>;
