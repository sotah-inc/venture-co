import {
  GameVersion,
  IConfigRegion,
  IExpansion,
  IShortProfession,
  UserLevel,
} from "@sotah-inc/core";

import {
  LoadBaseEntrypoint,
  LoadRealmEntrypoint,
  LoadRegionEntrypoint,
  LoadRootEntrypoint,
  LoadVersionEntrypoint,
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
    base: {
      load: (state: IMainState, _action: ReturnType<typeof LoadBaseEntrypoint>): IMainState => {
        const currentGameVersion = ((): GameVersion | null => {
          if (state.bootData.data.version_meta.length === 0) {
            return null;
          }

          return state.bootData.data.version_meta[0].name;
        })();

        return {
          ...state,
          currentGameVersion,
        };
      },
    },
    realm: {
      load: (state: IMainState, action: ReturnType<typeof LoadRealmEntrypoint>): IMainState => {
        const currentGameVersion =
          state.bootData.data.version_meta
            .map(v => v.name)
            .find(v => v === action.payload.nextGameVersion) ?? null;
        const currentRegion =
          state.bootData.data.regions.find(v => v.name === action.payload.nextRegionName) ?? null;

        const currentRealm: IClientRealm | null = (() => {
          if (currentRegion === null) {
            return null;
          }

          if (action.payload.realms === null) {
            return null;
          }

          return action.payload.realms.connectedRealms.reduce<IClientRealm | null>(
            (out, current) => {
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
            },
            null,
          );
        })();

        const hasExpansions =
          (state.bootData.data.version_meta.find(v => v.name === action.payload.nextGameVersion)
            ?.expansions.length ?? 0) > 0;
        if (!hasExpansions) {
          return {
            ...state,
            realms: {
              ...state.realms,
              level: FetchLevel.failure,
            },
          };
        }

        const currentExpansion: IExpansion | null =
          state.bootData.data.version_meta
            .find(v => v.name === action.payload.nextGameVersion)
            ?.expansions.find(v => v.name === action.payload.nextExpansionName) ?? null;

        const selectedProfession: IShortProfession | null =
          action.payload.realms?.professions.find(v => v.id === action.payload.nextProfessionId) ??
          null;

        return {
          ...receiveGetConnectedRealms(
            { ...state, currentGameVersion, currentRegion, currentExpansion },
            {
              type: RECEIVE_GET_CONNECTEDREALMS,
              payload: action.payload.realms,
            },
          ),
          currentRealm,
          selectedProfession,
        };
      },
    },
    region: {
      load: (state: IMainState, action: ReturnType<typeof LoadRegionEntrypoint>): IMainState => {
        const currentGameVersion =
          state.bootData.data.version_meta
            .map(v => v.name)
            .find(v => v === action.payload.nextGameVersion) ?? null;
        const currentRegion =
          state.bootData.data.regions.find(v => v.name === action.payload.nextRegionName) ?? null;

        return {
          ...receiveGetConnectedRealms(
            { ...state, currentGameVersion, currentRegion },
            {
              type: RECEIVE_GET_CONNECTEDREALMS,
              payload: action.payload.realms,
            },
          ),
        };
      },
    },
    root: {
      load: (state: IMainState, action: ReturnType<typeof LoadRootEntrypoint>): IMainState => {
        if (
          action.payload.boot === null ||
          action.payload.boot.regions.length === 0 ||
          action.payload.boot.version_meta.length === 0
        ) {
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

        const currentRegion = ((): IConfigRegion | null => {
          if (state.userPreferences.level !== FetchLevel.success) {
            return null;
          }

          return (
            action.payload.boot.regions.find(
              v => v.name === state.userPreferences.data.current_region,
            ) ?? null
          );
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
          renderMode: action.payload.renderMode,
          userData: action.payload.userData,
        };
      },
    },
    version: {
      load: (state: IMainState, action: ReturnType<typeof LoadVersionEntrypoint>): IMainState => {
        const currentGameVersion = state.bootData.data.version_meta
          .map(v => v.name)
          .includes(action.payload.nextGameVersion)
          ? action.payload.nextGameVersion
          : null;
        const currentRegion = ((): IConfigRegion | null => {
          if (state.bootData.data.regions.length === 0) {
            return null;
          }

          return (
            state.bootData.data.regions.find(
              v => state.userPreferences.data.current_region === v.name,
            ) ?? state.bootData.data.regions[0]
          );
        })();

        return {
          ...state,
          currentGameVersion,
          currentRegion,
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
