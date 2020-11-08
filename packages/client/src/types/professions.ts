import { IShortProfession } from "@sotah-inc/core";

import { IFetchData } from "./global";
import { FetchLevel } from "./main";

export interface IProfessionsState {
  professions: IFetchData<IShortProfession[]>;
}

export const defaultProfessionsState: IProfessionsState = {
  professions: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
};
