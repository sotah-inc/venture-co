import {
  IExpansion,
  IPreferenceJson,
  IRegionComposite,
  IShortProfession,
  IVerifyUserResponseData,
} from "@sotah-inc/core";

import { IClientRealm, IFetchData, IItemClasses, IProfile, IRegions } from "./global";

export interface IMainState {
  fetchPingLevel: FetchLevel;
  profile: IProfile | null;
  userPreferences: IPreferenceJson | null;
  fetchUserPreferencesLevel: FetchLevel;
  preloadedToken: string;
  isRegistered: boolean;
  isLoggedIn: boolean;
  regions: IRegions;
  currentRegion: IRegionComposite | null;
  fetchRealmLevel: FetchLevel;
  realms: IClientRealm[];
  currentRealm: IClientRealm | null;
  authLevel: AuthLevel;
  isLoginDialogOpen: boolean;
  expansions: IExpansion[];
  professions: IShortProfession[];
  itemClasses: IItemClasses;
  fetchBootLevel: FetchLevel;
  fetchItemClassesLevel: FetchLevel;
  isRegisterDialogOpen: boolean;
  firebaseConfig: {
    browser_api_key: string;
  };
  verifyUser: IFetchData<IVerifyUserResponseData>;
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
  currentRealm: null,
  currentRegion: null,
  expansions: [],
  fetchBootLevel: FetchLevel.initial,
  fetchItemClassesLevel: FetchLevel.initial,
  fetchPingLevel: FetchLevel.initial,
  fetchRealmLevel: FetchLevel.initial,
  fetchUserPreferencesLevel: FetchLevel.initial,
  firebaseConfig: {
    browser_api_key: "",
  },
  isLoggedIn: false,
  isLoginDialogOpen: false,
  isRegisterDialogOpen: false,
  isRegistered: false,
  itemClasses: {},
  preloadedToken: "",
  professions: [],
  profile: null,
  realms: [],
  regions: {},
  userPreferences: null,
  verifyUser: {
    data: {
      destination: "",
    },
    errors: {},
    level: FetchLevel.initial,
  },
};
