import { IShortProfession } from "../../short-profession";
import { IValidationErrorResponse } from "../index";

export interface IProfessionsResponseData {
  professions: IShortProfession[];
}

export type ProfessionsResponse = IProfessionsResponseData | IValidationErrorResponse | null;
