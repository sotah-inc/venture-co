import {
  IGetBootResponseData,
  IPreferenceJson,
  IRegionComposite,
  IVerifyUserResponseData,
} from "@sotah-inc/core";

import { IGetItemClassesResponseData } from "../../../core/src";
import { IClientRealm, IFetchData, IProfile } from "./global";

export type UserData =
  | {
      authLevel: AuthLevel.initial | AuthLevel.unauthenticated;
      profile: null;
      preloadedToken: string | null;
    }
  | {
      authLevel: AuthLevel.authenticated;
      profile: IProfile;
      preloadedToken: string | null;
    };

export interface IMainState {
  bootData: IFetchData<IGetBootResponseData>;

  preloadedToken: string;
  userData: UserData;
  verifyUser: IFetchData<IVerifyUserResponseData>;
  userPreferences: IFetchData<IPreferenceJson>;

  isRegisterDialogOpen: boolean;
  isLoginDialogOpen: boolean;

  currentRegion: IRegionComposite | null;

  realms: IFetchData<IClientRealm[]>;
  currentRealm: IClientRealm | null;

  itemClasses: IFetchData<IGetItemClassesResponseData>;
}

export enum FetchLevel {
  initial,
  prompted,
  fetching,
  refetching,
  success,
  failure,
}

export enum AuthLevel {
  initial,
  authenticated,
  unauthenticated,
}

export const defaultMainState: IMainState = {
  bootData: {
    level: FetchLevel.initial,
    errors: {},
    data: {
      regions: [],
      expansions: [],
      professions: [],
      firebase_config: {
        browser_api_key: "",
      },
    },
  },
  currentRealm: null,
  currentRegion: null,
  isLoginDialogOpen: false,
  isRegisterDialogOpen: false,
  itemClasses: {
    level: FetchLevel.initial,
    errors: {},
    data: {
      item_classes: [],
    },
  },
  preloadedToken: "",
  realms: {
    level: FetchLevel.initial,
    errors: {},
    data: [],
  },
  userPreferences: {
    level: FetchLevel.initial,
    errors: {},
    data: {
      id: 0,
      current_realm: null,
      current_region: null,
    },
  },
  userData: {
    authLevel: AuthLevel.initial,
    profile: null,
    preloadedToken: null,
  },
  verifyUser: {
    data: {
      destination: "",
    },
    errors: {},
    level: FetchLevel.initial,
  },
};
