import { IShortProfession } from "../../short-profession";
import { IValidationErrorResponse } from "../index";

export interface IProfessionsResponseData {
  professions: IShortProfession[];
}

export type ProfessionResponse = IProfessionsResponseData | IValidationErrorResponse | null;
