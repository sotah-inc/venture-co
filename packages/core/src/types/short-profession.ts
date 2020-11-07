import { SkillTierId } from "./short-skilltier";

export type ProfessionId = number;

export interface IShortProfession {
  id: ProfessionId;
  name: string;
  description: string;
  type: {
    type: string;
    name: string;
  }
  skilltiers: Array<{
    id: SkillTierId;
    name: string;
  }>
}