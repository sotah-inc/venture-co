import {
  IGetBootResponseData,
  IPreferenceJson,
  IRegionComposite,
  IVerifyUserResponseData,
} from "@sotah-inc/core";

import { IClientRealm, IFetchData, IItemClasses, IProfile } from "./global";

export interface IMainState {
  bootData: IFetchData<IGetBootResponseData>;

  preloadedToken: string;
  profile: IProfile | null;
  authLevel: AuthLevel;
  verifyUser: IFetchData<IVerifyUserResponseData>;
  userPreferences: IFetchData<IPreferenceJson>;

  isLoggedIn: boolean;
  isRegisterDialogOpen: boolean;
  isLoginDialogOpen: boolean;

  currentRegion: IRegionComposite | null;

  realms: IFetchData<IClientRealm[]>;
  currentRealm: IClientRealm | null;

  itemClasses: IFetchData<IItemClasses>;
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
  authLevel: AuthLevel.initial,
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
  isLoggedIn: false,
  isLoginDialogOpen: false,
  isRegisterDialogOpen: false,
  itemClasses: {
    level: FetchLevel.initial,
    errors: {},
    data: {},
  },
  preloadedToken: "",
  profile: null,
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
  verifyUser: {
    data: {
      destination: "",
    },
    errors: {},
    level: FetchLevel.initial,
  },
};
