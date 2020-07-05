import {
  IExpansion,
  IPreferenceJson,
  IProfession,
  IRealm,
  IRegionComposite,
} from "@sotah-inc/core";

import { IItemClasses, IProfile, IRealms, IRegions } from "./global";

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
  realms: IRealms;
  currentRealm: IRealm | null;
  authLevel: AuthLevel;
  isLoginDialogOpen: boolean;
  expansions: IExpansion[];
  professions: IProfession[];
  itemClasses: IItemClasses;
  fetchBootLevel: FetchLevel;
  isRegisterDialogOpen: boolean;
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
  fetchPingLevel: FetchLevel.initial,
  fetchRealmLevel: FetchLevel.initial,
  fetchUserPreferencesLevel: FetchLevel.initial,
  isLoggedIn: false,
  isLoginDialogOpen: false,
  isRegisterDialogOpen: false,
  isRegistered: false,
  itemClasses: {},
  preloadedToken: "",
  professions: [],
  profile: null,
  realms: {},
  regions: {},
  userPreferences: null,
};
