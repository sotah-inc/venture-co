import { IRegionComposite } from "@sotah-inc/core";

import {
  LoadGetBoot,
  LoadRealmEntrypoint,
  LoadRegionEntrypoint,
  MainActions,
  RECEIVE_GET_CONNECTEDREALMS,
  ReceiveGetBoot,
  ReceiveGetConnectedRealms,
  ReceiveGetPing,
  ReceiveGetUserPreferences,
} from "../../actions/main";
import { IClientRealm } from "../../types/global";
import { FetchLevel, IMainState } from "../../types/main";
import { FormatItemClassList, FormatRegionList } from "../../util";

import { IKindHandlers } from "./index";

function receiveGetConnectedRealmsHandler(
  state: IMainState,
  action: ReturnType<typeof ReceiveGetConnectedRealms>,
): IMainState {
  if (action.payload === null || action.payload.length === 0) {
    return { ...state, fetchRealmLevel: FetchLevel.failure };
  }

  const realms = action.payload.reduce<IClientRealm[]>((out, connectedRealm) => {
    return [
      ...out,
      ...connectedRealm.connected_realm.realms.map<IClientRealm>(v => {
        return {
          connectedRealmId: connectedRealm.connected_realm.id,
          population: connectedRealm.connected_realm.population,
          realm: v,
          realmModificationDates: connectedRealm.modification_dates,
          regionName: state.currentRegion?.config_region.name ?? "",
        };
      }),
    ];
  }, []);

  const currentRealm: IClientRealm = (() => {
    // optionally halting on blank user-preferences
    if (state.userPreferences === null || state.currentRegion === null) {
      return realms[0];
    }

    // defaulting to first realm in list if region is different from preferred region
    if (state.currentRegion.config_region.name !== state.userPreferences.current_region) {
      return realms[0];
    }

    // defaulting to first realm in list if non-match
    return realms.find(v => v.realm.slug === state.userPreferences?.current_realm) ?? realms[0];
  })();

  return { ...state, fetchRealmLevel: FetchLevel.success, realms, currentRealm };
}

export const handlers: IKindHandlers<IMainState, MainActions> = {
  boot: {
    get: {
      load: (state: IMainState, action: ReturnType<typeof LoadGetBoot>): IMainState => {
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
        const currentRegion =
          action.payload.boot.regions.find(
            v => v.config_region.name === action.payload.regionName,
          ) ?? action.payload.boot.regions[0];
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
                  population: v.connected_realm.population,
                  realm: connectedRealmRealm,
                  realmModificationDates: v.modification_dates,
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
      receive: (state: IMainState, action: ReturnType<typeof ReceiveGetBoot>): IMainState => {
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
      request: (state: IMainState): IMainState => {
        return { ...state, fetchBootLevel: FetchLevel.fetching };
      },
    },
  },
  connectedrealms: {
    get: {
      receive: receiveGetConnectedRealmsHandler,
      request: (state: IMainState): IMainState => {
        return { ...state, fetchRealmLevel: FetchLevel.fetching };
      },
    },
  },
  entrypoint: {
    realm: {
      load: (state: IMainState, action: ReturnType<typeof LoadRealmEntrypoint>): IMainState => {
        const currentRegion =
          Object.values(state.regions).find(
            v => v?.config_region.name === action.payload.nextRegionName,
          ) ?? null;
        const currentRealm: IClientRealm | null = (() => {
          if (currentRegion === null) {
            return null;
          }

          if (action.payload.realms === null) {
            return null;
          }

          return action.payload.realms.reduce<IClientRealm | null>((out, current) => {
            if (out !== null) {
              return out;
            }

            return current.connected_realm.realms.reduce<IClientRealm | null>(
              (connectedOut, connectedRealm) => {
                if (connectedOut !== null) {
                  return connectedOut;
                }

                if (connectedRealm.slug === action.payload.nextRealmSlug) {
                  return {
                    connectedRealmId: current.connected_realm.id,
                    population: current.connected_realm.population,
                    realm: connectedRealm,
                    realmModificationDates: current.modification_dates,
                    regionName: currentRegion.config_region.name,
                  };
                }

                return null;
              },
              null,
            );
          }, null);
        })();

        return {
          ...state,
          ...receiveGetConnectedRealmsHandler(state, {
            type: RECEIVE_GET_CONNECTEDREALMS,
            payload: action.payload.realms,
          }),
          currentRealm,
          currentRegion,
        };
      },
    },
    region: {
      load: (state: IMainState, action: ReturnType<typeof LoadRegionEntrypoint>): IMainState => {
        const currentRegion =
          Object.values(state.regions).find(
            v => v?.config_region.name === action.payload.nextRegionName,
          ) ?? null;

        return {
          ...state,
          ...receiveGetConnectedRealmsHandler(state, {
            type: RECEIVE_GET_CONNECTEDREALMS,
            payload: action.payload.realms,
          }),
          currentRegion,
        };
      },
    },
  },
  ping: {
    get: {
      receive: (state: IMainState, action: ReturnType<typeof ReceiveGetPing>): IMainState => {
        if (!action.payload) {
          return { ...state, fetchPingLevel: FetchLevel.failure };
        }

        return { ...state, fetchPingLevel: FetchLevel.success };
      },
      request: (state: IMainState): IMainState => {
        return { ...state, fetchPingLevel: FetchLevel.fetching };
      },
    },
  },
  userpreferences: {
    get: {
      receive: (
        state: IMainState,
        action: ReturnType<typeof ReceiveGetUserPreferences>,
      ): IMainState => {
        if (action.payload.error !== null) {
          return { ...state, fetchUserPreferencesLevel: FetchLevel.failure };
        }

        return {
          ...state,
          fetchUserPreferencesLevel: FetchLevel.success,
          userPreferences: action.payload.preference,
        };
      },
      request: (state: IMainState): IMainState => {
        return { ...state };
      },
    },
  },
};

export function run(state: IMainState, action: MainActions): IMainState {
  const [kind, verb, task] = action.type
    .split("_")
    .reverse()
    .map(v => v.toLowerCase());
  const taskHandler = handlers[kind]?.[verb]?.[task] ?? null;
  if (taskHandler === null) {
    return state;
  }

  return taskHandler(state, action);
}
