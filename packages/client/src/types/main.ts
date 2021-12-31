import {
  GameVersion,
  IConfigRegion,
  IExpansion,
  IGetBootResponseData,
  IGetItemClassesResponseData,
  IPreferenceJson,
  IShortProfession,
  IVerifyUserResponseData,
} from "@sotah-inc/core";

import { IClientRealm, IFetchData, IProfile, RenderMode } from "./global";

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

  renderMode: RenderMode;
  preloadedToken: string;
  userData: UserData;
  verifyUser: IFetchData<IVerifyUserResponseData>;
  userPreferences: IFetchData<IPreferenceJson>;

  isRegisterDialogOpen: boolean;
  isLoginDialogOpen: boolean;

  currentGameVersion: GameVersion | null;

  currentRegion: IConfigRegion | null;

  realms: IFetchData<IClientRealm[]>;
  currentRealm: IClientRealm | null;

  professions: IShortProfession[];
  selectedProfession: IShortProfession | null;

  currentExpansion: IExpansion | null;

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
      firebase_config: {
        browser_api_key: "",
      },
      version_meta: [],
    },
  },
  currentExpansion: null,
  currentGameVersion: null,
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
  professions: [],
  selectedProfession: null,
  realms: {
    level: FetchLevel.initial,
    errors: {},
    data: [],
  },
  renderMode: RenderMode.Initial,
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
