import {
  GameVersion,
  IConfigRegion,
  IGetBootResponseData,
  IGetItemClassesResponseData,
  IGetRegionResponseData,
  IPreferenceJson,
  IVerifyUserResponseData,
} from "@sotah-inc/core";

import { IClientRealm, IFetchData, IProfile, IVersionToggleConfig, RenderMode } from "./global";

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
  regionData: IFetchData<IGetRegionResponseData>;

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

  itemClasses: IFetchData<IGetItemClassesResponseData>;

  versionToggleConfig: IVersionToggleConfig;
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
      feature_flags: {},
      game_versions: [],
      regions: [],
      firebase_config: {
        browser_api_key: "",
      },
    },
  },
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
  realms: {
    level: FetchLevel.initial,
    errors: {},
    data: [],
  },
  regionData: {
    level: FetchLevel.initial,
    errors: {},
    data: {
      connectedRealms: [],
      professions: [],
      expansions: [],
    },
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
  versionToggleConfig: {
    destinations: [],
  },
};
