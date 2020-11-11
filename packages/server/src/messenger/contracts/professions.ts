import { IShortProfession, IShortSkillTier } from "@sotah-inc/core";

export interface IProfessionsResponse {
  professions: IShortProfession[];
}

export interface ISkillTierResponse {
  skillTier: IShortSkillTier;
}
