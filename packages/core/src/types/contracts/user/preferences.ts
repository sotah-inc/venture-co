import { IPreferenceJson } from "../../entities";
import { RealmSlug, RegionName } from "../../region";
import { IValidationErrorResponse } from "../index";

export interface IGetPreferencesResponseData {
  preference: IPreferenceJson;
}

export type GetPreferencesResponse = IGetPreferencesResponseData | IValidationErrorResponse;

export interface ICreatePreferencesRequest {
  id?: number;
  current_region: RegionName | null;
  current_realm: RealmSlug | null;
}

export type CreatePreferencesResponse = GetPreferencesResponse;

export type UpdatePreferencesRequest = ICreatePreferencesRequest;

export type UpdatePreferencesResponse = GetPreferencesResponse;
