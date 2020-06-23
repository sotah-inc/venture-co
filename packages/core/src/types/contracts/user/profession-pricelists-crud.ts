import { IPricelistEntryJson, IPricelistJson, IProfessionPricelistJson } from "../../entities";
import { ExpansionName } from "../../expansion";
import { ProfessionName } from "../../profession";
import { IValidationErrorResponse } from "../index";

export interface ICreateProfessionPricelistRequest {
  pricelist: {
    name: string;
    slug: string;
  };
  entries: Array<{
    id?: number;
    item_id: number;
    quantity_modifier: number;
  }>;
  profession_name: ProfessionName;
  expansion_name: ExpansionName;
}

export interface ICreateProfessionPricelistResponseData {
  entries: IPricelistEntryJson[];
  pricelist: IPricelistJson;
  profession_pricelist: IProfessionPricelistJson;
}

export type CreateProfessionPricelistResponse =
  | ICreateProfessionPricelistResponseData
  | IValidationErrorResponse;

export type DeleteProfessionPricelist = IValidationErrorResponse | null;
