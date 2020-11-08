import { Locale } from "@sotah-inc/core";
import { Dispatch } from "redux";

import { IProfessionsResult, professions } from "../api/data";
import { ActionsUnion, createAction } from "./helpers";

export const REQUEST_GET_PROFESSIONS = "REQUEST_GET_PROFESSIONS";
export const RequestGetProfessions = () => createAction(REQUEST_GET_PROFESSIONS);
export const RECEIVE_GET_PROFESSIONS = "RECEIVE_GET_PROFESSIONS";
export const ReceiveGetProfessions = (payload: IProfessionsResult | null) =>
  createAction(RECEIVE_GET_PROFESSIONS, payload);
type FetchGetProfessionsType = ReturnType<
  typeof RequestGetProfessions | typeof ReceiveGetProfessions
>;
export const FetchGetProfessions = (locale: Locale) => {
  return async (dispatch: Dispatch<FetchGetProfessionsType>) => {
    dispatch(RequestGetProfessions());
    dispatch(ReceiveGetProfessions(await professions(locale)));
  };
};

export const ProfessionsActions = {
  ReceiveGetProfessions,
  RequestGetProfessions,
};

export type ProfessionsActions = ActionsUnion<typeof ProfessionsActions>;
