import { IShortProfession } from "../../short-profession";
import { IShortSkillTier } from "../../short-skilltier";
import { IValidationErrorResponse } from "../index";

export interface IProfessionsResponseData {
  professions: IShortProfession[];
}

export type ProfessionsResponse = IProfessionsResponseData | IValidationErrorResponse | null;

export interface ISkillTierResponseData {
  skillTier: IShortSkillTier;
}

export type SkillTierResponse = ISkillTierResponseData | IValidationErrorResponse | null;
