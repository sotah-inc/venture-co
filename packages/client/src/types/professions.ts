import { IShortProfession } from "@sotah-inc/core";

import { IFetchData } from "./global";
import { FetchLevel } from "./main";

export interface IProfessionsState {
  loadId: string;
  professions: IFetchData<IShortProfession[]>;
}

export const defaultProfessionsState: IProfessionsState = {
  loadId: "",
  professions: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
};
