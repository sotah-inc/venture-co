import { IRegionComposite, UserLevel } from "@sotah-inc/core";

import {
  LoadRealmEntrypoint,
  LoadRegionEntrypoint,
  MainActions,
  RECEIVE_GET_CONNECTEDREALMS,
  ReceiveGetConnectedRealms as ReceiveGetConnectedRealmsAction,
  ReceiveGetItemClasses,
  ReceiveGetUserPreferences,
  ReceiveVerifyUser,
} from "../../actions/main";
import { VerifyUserCode } from "../../api/user";
import { IClientRealm } from "../../types/global";
import { defaultMainState, FetchLevel, IMainState } from "../../types/main";
import { FormatItemClassList, FormatRegionList } from "../../util";

import { IKindHandlers } from "./index";

function receiveGetConnectedRealms(
  state: IMainState,
  action: ReturnType<typeof ReceiveGetConnectedRealmsAction>,
): IMainState {
  if (action.payload === null || action.payload.length === 0) {
    return { ...state, realms: { ...state.realms, level: FetchLevel.failure } };
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
    if (state.userPreferences.level !== FetchLevel.success) {
      return realms[0];
    }

    if (state.currentRegion === null || state.userPreferences.data.current_realm === null) {
      return realms[0];
    }

    // defaulting to first realm in list if region is different from preferred region
    if (state.currentRegion.config_region.name !== state.userPreferences.data.current_realm) {
      return realms[0];
    }

    // defaulting to first realm in list if non-match
    return realms.find(v => v.realm.slug === state.userPreferences.data.current_realm) ?? realms[0];
  })();

  return {
    ...state,
    currentRealm,
    realms: { level: FetchLevel.success, data: realms, errors: {} },
  };
}

export const handlers: IKindHandlers<IMainState, MainActions> = {
  boot: {
    get: {
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

        return {
          ...state,
          currentRegion,
          expansions: action.payload.expansions,
          fetchBootLevel: FetchLevel.success,
          firebaseConfig: action.payload.firebase_config,
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
      receive: receiveGetConnectedRealms,
      request: (state: IMainState): IMainState => {
        return { ...state, realms: { ...state.realms, level: FetchLevel.fetching } };
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
  itemclasses: {
    get: {
      receive: (
        state: IMainState,
        action: ReturnType<typeof ReceiveGetItemClasses>,
      ): IMainState => {
        if (action.payload === null) {
          return { ...state, fetchItemClassesLevel: FetchLevel.failure };
        }

        return {
          ...state,
          fetchItemClassesLevel: FetchLevel.success,
          itemClasses: FormatItemClassList(action.payload.item_classes),
        };
      },
      request: (state: IMainState): IMainState => {
        return { ...state, fetchItemClassesLevel: FetchLevel.fetching };
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
  user: {
    verify: {
      receive: (state: IMainState, action: ReturnType<typeof ReceiveVerifyUser>): IMainState => {
        switch (action.payload.code) {
        case VerifyUserCode.Ok:
          return {
            ...state,
            verifyUser: {
              level: FetchLevel.success,
              errors: {},
              data: { destination: action.payload.destination },
            },
          };
        case VerifyUserCode.AlreadyVerified:
          if (state.profile === null) {
            return { ...state };
          }

          return {
            ...state,
            verifyUser: defaultMainState.verifyUser,
            profile: {
              ...state.profile,
              user: {
                ...state.profile.user,
                level: UserLevel.Regular,
              },
            },
          };
        case VerifyUserCode.Error:
          return {
            ...state,
            verifyUser: {
              ...state.verifyUser,
              level: FetchLevel.failure,
              errors: action.payload.errors,
            },
          };
        default:
          break;
        }

        return {
          ...state,
          verifyUser: {
            ...state.verifyUser,
            level: FetchLevel.failure,
            errors: {},
          },
        };
      },
      request: (state: IMainState): IMainState => {
        return { ...state, verifyUser: { ...state.verifyUser, level: FetchLevel.fetching } };
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
