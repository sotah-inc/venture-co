import { IConfigRegion, UserLevel } from "@sotah-inc/core";

import {
  LoadRealmEntrypoint,
  LoadRegionEntrypoint,
  LoadRootEntrypoint,
  MainActions,
  RECEIVE_GET_CONNECTEDREALMS,
  ReceiveGetUserPreferences,
  ReceiveVerifyUser,
} from "../../actions/main";
import { VerifyUserCode } from "../../api/user";
import { IClientRealm } from "../../types/global";
import { defaultMainState, FetchLevel, IMainState } from "../../types/main";
import { receiveGetConnectedRealms } from "./receivers";

import { IKindHandlers } from "./index";

export const handlers: IKindHandlers<IMainState, MainActions> = {
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
          state.bootData.data.regions.find(
            v => v?.name === action.payload.nextRegionName,
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
                    statusTimestamps: current.status_timestamps,
                    regionName: currentRegion.name,
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
          ...receiveGetConnectedRealms(state, {
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
          state.bootData.data.regions.find(
            v => v?.name === action.payload.nextRegionName,
          ) ?? null;

        return {
          ...state,
          ...receiveGetConnectedRealms(state, {
            type: RECEIVE_GET_CONNECTEDREALMS,
            payload: action.payload.realms,
          }),
          currentRegion,
        };
      },
    },
    root: {
      load: (state: IMainState, action: ReturnType<typeof LoadRootEntrypoint>): IMainState => {
        if (action.payload.boot === null || action.payload.boot.regions.length === 0) {
          return {
            ...state,
            bootData: {
              ...state.bootData,
              level: FetchLevel.failure,
            },
          };
        }
        if (action.payload.itemClasses === null) {
          return {
            ...state,
            itemClasses: {
              ...state.itemClasses,
              level: FetchLevel.failure,
            },
          };
        }

        const currentRegion = ((): IConfigRegion => {
          if (state.userPreferences.level !== FetchLevel.success) {
            return action.payload.boot.regions[0];
          }

          const { current_region: preferredRegionName } = state.userPreferences.data;
          const foundRegion = action.payload.boot.regions.reduce<IConfigRegion | null>(
            (result: IConfigRegion | null, v) => {
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
            return action.payload.boot.regions[0];
          }

          return foundRegion;
        })();

        return {
          ...state,
          bootData: {
            level: FetchLevel.success,
            data: action.payload.boot,
            errors: {},
          },
          currentRegion,
          itemClasses: {
            level: FetchLevel.success,
            data: action.payload.itemClasses,
            errors: {},
          },
        };
      },
    },
  },
  userpreferences: {
    get: {
      receive: (
        state: IMainState,
        action: ReturnType<typeof ReceiveGetUserPreferences>,
      ): IMainState => {
        if (action.payload.error !== null || action.payload.preference === null) {
          return {
            ...state,
            userPreferences: { ...state.userPreferences, level: FetchLevel.failure },
          };
        }

        return {
          ...state,
          userPreferences: {
            level: FetchLevel.success,
            data: action.payload.preference,
            errors: {},
          },
        };
      },
      request: (state: IMainState): IMainState => {
        return {
          ...state,
          userPreferences: { ...state.userPreferences, level: FetchLevel.fetching },
        };
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
          if (state.userData.profile === null) {
            return { ...state };
          }

          return {
            ...state,
            verifyUser: defaultMainState.verifyUser,
            userData: {
              ...state.userData,
              profile: {
                ...state.userData.profile,
                user: {
                  ...state.userData.profile.user,
                  level: UserLevel.Regular,
                },
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
