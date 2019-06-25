import { IErrors } from "./global";

import { FetchLevel } from "./main";

export interface IProfileState {
  updateProfileLevel: FetchLevel;
  updateProfileErrors: IErrors;
}

export const defaultProfileState: IProfileState = {
  updateProfileErrors: {},
  updateProfileLevel: FetchLevel.initial,
};
