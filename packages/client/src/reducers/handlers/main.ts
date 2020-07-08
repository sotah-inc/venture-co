import { IRegionComposite } from "@sotah-inc/core";

import {
  LoadGetBoot,
  LoadRealmEntrypoint,
  LoadRegionEntrypoint,
  MainActions,
  ReceiveGetBoot,
  ReceiveGetPing,
  ReceiveGetRealms,
  ReceiveGetUserPreferences,
} from "../../actions/main";
import { FetchLevel, IMainState } from "../../types/main";
import { FormatItemClassList, FormatRegionList } from "../../util";
import { IKindHandlers, Runner, runners } from "./index";
import { IClientRealm } from "../../types/global";

export const handlers: IKindHandlers<IMainState, MainActions> = {
  boot: {
    get: {
      load: (state: IMainState, action: ReturnType<typeof LoadGetBoot>) => {
        if (action.payload.boot === null) {
          return {
            ...state,
            fetchBootLevel: FetchLevel.failure,
            fetchPingLevel: FetchLevel.success,
          };
        }

        if (action.payload.realms === null) {
          return {
            ...state,
            fetchBootLevel: FetchLevel.success,
            fetchPingLevel: FetchLevel.success,
            fetchRealmLevel: FetchLevel.failure,
          };
        }

        const regions = FormatRegionList(action.payload.boot.regions);
        const currentRegion: IRegionComposite = (() => {
          const foundRegion: IRegionComposite | null = action.payload.boot.regions.reduce(
            (result: IRegionComposite | null, v) => {
              if (result !== null) {
                return result;
              }

              if (v.config_region.name === action.payload.regionName) {
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

        const realms: IClientRealm[] = (() => {
          if (action.payload.realms === null) {
            return [];
          }

          return action.payload.realms.reduce<IClientRealm[]>((realmsResult, v) => {
            return [
              ...realmsResult,
              ...v.connected_realm.realms.map<IClientRealm>(connectedRealmRealm => {
                return {
                  connectedRealmId: v.connected_realm.id,
                  realm: connectedRealmRealm,
                  regionName: currentRegion.config_region.name,
                };
              }),
            ];
          }, []);
        })();
        const currentRealm: IClientRealm | null = (() => {
          if (typeof action.payload.realmSlug === "undefined") {
            return realms[0];
          }

          return realms.reduce((result: IClientRealm | null, v) => {
            if (result !== null) {
              return result;
            }

            if (v.realm.slug === action.payload.realmSlug) {
              return v;
            }

            return null;
          }, null);
        })();

        const itemClasses = FormatItemClassList(action.payload.boot.item_classes);

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

        const currentRegion: IRegionComposite = (() => {
          if (state.userPreferences === null) {
            return action.payload.regions[0];
          }

          const { current_region: preferredRegionName } = state.userPreferences;
          const foundRegion: IRegionComposite | null = action.payload.regions.reduce(
            (result: IRegionComposite | null, v) => {
              if (result !== null) {
                return result;
              }

              if (v.config_region.name === preferredRegionName) {
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
        const itemClasses = FormatItemClassList(action.payload.item_classes);

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
  entrypoint: {
    realm: {
      load: (state: IMainState, action: ReturnType<typeof LoadRealmEntrypoint>) => {
        const currentRegion = Object.keys(state.regions).reduce<IRegionComposite | null>(
          (out, current) => {
            if (out !== null) {
              return out;
            }

            if (current === action.payload.nextRegionName) {
              return state.regions[current];
            }

            return null;
          },
          null,
        );
        const currentRealm: IStatusRealm | null = (() => {
          if (action.payload.realms === null) {
            return null;
          }

          return action.payload.realms.reduce<IStatusRealm | null>((out, current) => {
            if (out !== null) {
              return out;
            }

            if (current.slug === action.payload.nextRealmSlug) {
              return current;
            }

            return null;
          }, null);
        })();

        return {
          ...runners.main(state, ReceiveGetRealms(action.payload.realms)),
          currentRealm,
          currentRegion,
        };
      },
    },
    region: {
      load: (state: IMainState, action: ReturnType<typeof LoadRegionEntrypoint>) => {
        const currentRegion = Object.keys(state.regions).reduce<IRegionComposite | null>(
          (out, current) => {
            if (out !== null) {
              return out;
            }

            if (current === action.payload.nextRegionName) {
              return state.regions[current];
            }

            return null;
          },
          null,
        );

        return {
          ...runners.main(state, ReceiveGetRealms(action.payload.realms)),
          currentRegion,
        };
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
          if (
            state.currentRegion !== null &&
            state.currentRegion.config_region.name !== preferredRegionName
          ) {
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
