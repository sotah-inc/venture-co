import { IPricelistEntryJson, IPricelistJson, IProfessionPricelistJson } from "../../entities";
import { ExpansionName } from "../../expansion";
import { ProfessionId } from "../../short-profession";
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
  profession_id: ProfessionId;
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

export type DeleteProfessionPricelistResponse = IValidationErrorResponse | null;
