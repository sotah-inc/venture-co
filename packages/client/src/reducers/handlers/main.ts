import { IRegion, IStatusRealm } from "@sotah-inc/core";

import {
  LoadGetBoot,
  MainActions,
  ReceiveGetBoot,
  ReceiveGetPing,
  ReceiveGetRealms,
  ReceiveGetUserPreferences,
} from "../../actions/main";
import { IRealms } from "../../types/global";
import { FetchLevel, IMainState } from "../../types/main";
import { FormatItemClassList, FormatRealmList, FormatRegionList } from "../../util";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IMainState, MainActions> = {
  boot: {
    get: {
      load: (state: IMainState, action: ReturnType<typeof LoadGetBoot>) => {
        if (action.payload.boot === null || action.payload.boot.regions.length === 0) {
          return { ...state, fetchBootLevel: FetchLevel.failure };
        }

        const regions = FormatRegionList(action.payload.boot.regions);
        const currentRegion: IRegion = (() => {
          const foundRegion: IRegion | null = action.payload.boot.regions.reduce(
            (result: IRegion | null, v) => {
              if (result !== null) {
                return result;
              }

              if (v.name === action.payload.regionName) {
                return v;
              }

              return null;
            },
            null,
          );

          if (foundRegion === null) {
            return action.payload.boot.regions[0];
          }

          return foundRegion;
        })();

        const realms: IRealms = (() => {
          if (typeof action.payload.realms === "undefined" || action.payload.realms === null) {
            return [];
          }

          return FormatRealmList(action.payload.realms);
        })();
        const currentRealm: IStatusRealm | null = (() => {
          if (
            typeof action.payload.realms === "undefined" ||
            action.payload.realms === null ||
            action.payload.realms.length === 0 ||
            typeof action.payload.realmSlug === "undefined"
          ) {
            return null;
          }

          const foundRealm: IStatusRealm | null = action.payload.realms.reduce(
            (result: IStatusRealm | null, v) => {
              if (result !== null) {
                return result;
              }

              if (v.slug === action.payload.realmSlug) {
                return v;
              }

              return null;
            },
            null,
          );

          if (foundRealm === null) {
            return action.payload.realms[0];
          }

          return foundRealm;
        })();

        const itemClasses = FormatItemClassList(action.payload.boot.item_classes.classes);

        return {
          ...state,
          currentRealm,
          currentRegion,
          expansions: action.payload.boot.expansions,
          fetchBootLevel: FetchLevel.success,
          fetchPingLevel: FetchLevel.success,
          fetchRealmLevel: FetchLevel.success,
          itemClasses,
          professions: action.payload.boot.professions,
          realms,
          regions,
        };
      },
      receive: (state: IMainState, action: ReturnType<typeof ReceiveGetBoot>) => {
        if (action.payload === null) {
          return { ...state, fetchBootLevel: FetchLevel.failure };
        }

        const currentRegion: IRegion = (() => {
          if (state.userPreferences === null) {
            return action.payload.regions[0];
          }

          const { current_region: preferredRegionName } = state.userPreferences;
          const foundRegion: IRegion | null = action.payload.regions.reduce(
            (result: IRegion | null, v) => {
              if (result !== null) {
                return result;
              }

              if (v.name === preferredRegionName) {
                return v;
              }

              return null;
            },
            null,
          );

          if (foundRegion === null) {
            return action.payload.regions[0];
          }

          return foundRegion;
        })();

        const regions = FormatRegionList(action.payload.regions);
        const itemClasses = FormatItemClassList(action.payload.item_classes.classes);

        return {
          ...state,
          currentRegion,
          expansions: action.payload.expansions,
          fetchBootLevel: FetchLevel.success,
          itemClasses,
          professions: action.payload.professions,
          regions,
        };
      },
      request: (state: IMainState) => {
        return { ...state, fetchBootLevel: FetchLevel.fetching };
      },
    },
  },
  ping: {
    get: {
      receive: (state: IMainState, action: ReturnType<typeof ReceiveGetPing>) => {
        if (!action.payload) {
          return { ...state, fetchPingLevel: FetchLevel.failure };
        }

        return { ...state, fetchPingLevel: FetchLevel.success };
      },
      request: (state: IMainState) => {
        return { ...state, fetchPingLevel: FetchLevel.fetching };
      },
    },
  },
  realms: {
    get: {
      receive: (state: IMainState, action: ReturnType<typeof ReceiveGetRealms>) => {
        if (action.payload === null || action.payload.length === 0) {
          return { ...state, fetchRealmLevel: FetchLevel.failure };
        }

        const currentRealm: IStatusRealm = (() => {
          // optionally halting on blank user-preferences
          if (state.userPreferences === null) {
            return action.payload[0];
          }

          const {
            current_region: preferredRegionName,
            current_realm: preferredRealmSlug,
          } = state.userPreferences;

          // defaulting to first realm in list if region is different from preferred region
          if (state.currentRegion!.name !== preferredRegionName) {
            return action.payload[0];
          }

          // gathering preferred realm
          const foundRealm = action.payload.reduce<IStatusRealm | null>((result, v) => {
            if (result !== null) {
              return result;
            }

            if (v.slug === preferredRealmSlug) {
              return v;
            }

            return null;
          }, null);

          // optionally halting on realm non-match against preferred realm name
          if (foundRealm === null) {
            return action.payload[0];
          }

          // dumping out preferred realm
          return foundRealm;
        })();

        const realms = FormatRealmList(action.payload);

        return { ...state, fetchRealmLevel: FetchLevel.success, realms, currentRealm };
      },
      request: (state: IMainState) => {
        return { ...state, fetchRealmLevel: FetchLevel.fetching };
      },
    },
  },
  userpreferences: {
    get: {
      receive: (state: IMainState, action: ReturnType<typeof ReceiveGetUserPreferences>) => {
        if (action.payload.error !== null) {
          return { ...state, fetchUserPreferencesLevel: FetchLevel.failure };
        }

        return {
          ...state,
          fetchUserPreferencesLevel: FetchLevel.success,
          userPreferences: action.payload.preference,
        };
      },
      request: (state: IMainState) => {
        return { ...state };
      },
    },
  },
};

export const run: Runner<IMainState, MainActions> = (
  state: IMainState,
  action: MainActions,
): IMainState => {
  const [kind, verb, task] = action.type
    .split("_")
    .reverse()
    .map(v => v.toLowerCase());
  if (!(kind in handlers)) {
    return state;
  }
  const kindHandlers = handlers[kind];

  if (!(verb in kindHandlers)) {
    return state;
  }
  const verbHandlers = kindHandlers[verb];

  if (!(task in verbHandlers)) {
    return state;
  }
  const taskHandler = verbHandlers[task];

  return taskHandler(state, action);
};
