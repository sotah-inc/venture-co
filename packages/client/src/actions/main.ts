/* eslint-disable func-style,@typescript-eslint/explicit-module-boundary-types */
import {
  ExpansionName,
  GameVersion,
  IConfigRegion,
  ICreatePreferencesRequest,
  IGetBootResponseData,
  IGetItemClassesResponseData,
  RealmSlug,
  RegionName,
  UpdatePreferencesRequest,
} from "@sotah-inc/core";
import { IGetConnectedRealmsResponseData } from "@sotah-inc/core/build/dist/types/contracts/data";
import { Dispatch } from "redux";

import { getConnectedRealms, IGetConnectedRealmsOptions } from "../api/data";
import {
  createPreferences,
  getPreferences,
  ICreatePreferencesResult,
  IGetPreferencesResult,
  IUpdatePreferencesResult,
  updatePreferences,
  verifyUser,
  VerifyUserResult,
} from "../api/user";
import { IClientRealm, IProfile, RenderMode } from "../types/global";
import { UserData } from "../types/main";
import { ActionsUnion, createAction } from "./helpers";

export const USER_REGISTER = "USER_REGISTER";
export const UserRegister = (payload: IProfile) => createAction(USER_REGISTER, payload);

export const USER_LOGIN = "USER_LOGIN";
export const UserLogin = (payload: IProfile) => createAction(USER_LOGIN, payload);

export const REQUEST_GET_USERPREFERENCES = "REQUEST_GET_USERPREFERENCES";
export const RECEIVE_GET_USERPREFERENCES = "RECEIVE_GET_USERPREFERENCES";
export const RequestGetUserPreferences = () => createAction(REQUEST_GET_USERPREFERENCES);
export const ReceiveGetUserPreferences = (payload: IGetPreferencesResult) =>
  createAction(RECEIVE_GET_USERPREFERENCES, payload);
type FetchGetUserPreferencesType = ReturnType<
  typeof RequestGetUserPreferences | typeof ReceiveGetUserPreferences
>;
export const FetchGetUserPreferences = (token: string) => {
  return async (dispatch: Dispatch<FetchGetUserPreferencesType>) => {
    dispatch(RequestGetUserPreferences());
    dispatch(ReceiveGetUserPreferences(await getPreferences(token)));
  };
};

export const REQUEST_USER_PREFERENCES_CREATE = "REQUEST_USER_PREFERENCES_CREATE";
export const RECEIVE_USER_PREFERENCES_CREATE = "RECEIVE_USER_PREFERENCES_CREATE";
const RequestUserPreferencesCreate = () => createAction(REQUEST_USER_PREFERENCES_CREATE);
const ReceiveUserPreferencesCreate = (payload: ICreatePreferencesResult) =>
  createAction(RECEIVE_USER_PREFERENCES_CREATE, payload);
type FetchUserPreferencesCreateType = ReturnType<
  typeof RequestUserPreferencesCreate | typeof ReceiveUserPreferencesCreate
>;
export const FetchUserPreferencesCreate = (token: string, body: ICreatePreferencesRequest) => {
  return async (dispatch: Dispatch<FetchUserPreferencesCreateType>) => {
    dispatch(RequestUserPreferencesCreate());
    dispatch(ReceiveUserPreferencesCreate(await createPreferences(token, body)));
  };
};

export const REQUEST_USER_PREFERENCES_UPDATE = "REQUEST_USER_PREFERENCES_UPDATE";
export const RECEIVE_USER_PREFERENCES_UPDATE = "RECEIVE_USER_PREFERENCES_UPDATE";
const RequestUserPreferencesUpdate = () => createAction(REQUEST_USER_PREFERENCES_UPDATE);
const ReceiveUserPreferencesUpdate = (payload: IUpdatePreferencesResult) =>
  createAction(RECEIVE_USER_PREFERENCES_UPDATE, payload);
type FetchUserPreferencesUpdateType = ReturnType<
  typeof RequestUserPreferencesUpdate | typeof ReceiveUserPreferencesUpdate
>;
export const FetchUserPreferencesUpdate = (token: string, body: UpdatePreferencesRequest) => {
  return async (dispatch: Dispatch<FetchUserPreferencesUpdateType>) => {
    dispatch(RequestUserPreferencesUpdate());
    dispatch(ReceiveUserPreferencesUpdate(await updatePreferences(token, body)));
  };
};

export const REQUEST_VERIFY_USER = "REQUEST_VERIFY_USER";
export const RECEIVE_VERIFY_USER = "RECEIVE_VERIFY_USER";
export const RequestVerifyUser = () => createAction(REQUEST_VERIFY_USER);
export const ReceiveVerifyUser = (payload: VerifyUserResult) =>
  createAction(RECEIVE_VERIFY_USER, payload);
type FetchVerifyUserType = ReturnType<typeof RequestVerifyUser | typeof ReceiveVerifyUser>;
export const FetchVerifyUser = (token: string) => {
  return async (dispatch: Dispatch<FetchVerifyUserType>) => {
    dispatch(RequestVerifyUser());
    dispatch(ReceiveVerifyUser(await verifyUser(token)));
  };
};

export const REGION_CHANGE = "REGION_CHANGE";
export const RegionChange = (payload: IConfigRegion) => createAction(REGION_CHANGE, payload);

export const REQUEST_GET_CONNECTEDREALMS = "REQUEST_GET_CONNECTEDREALMS";
export const RECEIVE_GET_CONNECTEDREALMS = "RECEIVE_GET_CONNECTEDREALMS";
export const RequestGetConnectedRealms = () => createAction(REQUEST_GET_CONNECTEDREALMS);
export const ReceiveGetConnectedRealms = (payload: IGetConnectedRealmsResponseData | null) =>
  createAction(RECEIVE_GET_CONNECTEDREALMS, payload);
type FetchGetConnectedRealmsType = ReturnType<
  typeof RequestGetConnectedRealms | typeof ReceiveGetConnectedRealms
>;
export const FetchGetConnectedRealms = (opts: IGetConnectedRealmsOptions) => {
  return async (dispatch: Dispatch<FetchGetConnectedRealmsType>) => {
    dispatch(RequestGetConnectedRealms());
    dispatch(ReceiveGetConnectedRealms(await getConnectedRealms(opts)));
  };
};

export const REALM_CHANGE = "REALM_CHANGE";
export const RealmChange = (payload: IClientRealm) => createAction(REALM_CHANGE, payload);

export const CHANGE_IS_LOGIN_DIALOG_OPEN = "CHANGE_IS_LOGIN_DIALOG_OPEN";
export const ChangeIsLoginDialogOpen = (payload: boolean) =>
  createAction(CHANGE_IS_LOGIN_DIALOG_OPEN, payload);

export const CHANGE_IS_REGISTER_DIALOG_OPEN = "CHANGE_IS_REGISTER_DIALOG_OPEN";
export const ChangeIsRegisterDialogOpen = (payload: boolean) =>
  createAction(CHANGE_IS_REGISTER_DIALOG_OPEN, payload);

export interface ILoadRootEntrypoint {
  renderMode: RenderMode;
  userData: UserData;
  boot: IGetBootResponseData | null;
  itemClasses: IGetItemClassesResponseData | null;
}

export const LOAD_ROOT_ENTRYPOINT = "LOAD_ROOT_ENTRYPOINT";
export const LoadRootEntrypoint = (payload: ILoadRootEntrypoint) =>
  createAction(LOAD_ROOT_ENTRYPOINT, payload);

export const LOAD_BASE_ENTRYPOINT = "LOAD_BASE_ENTRYPOINT";
export const LoadBaseEntrypoint = () => createAction(LOAD_BASE_ENTRYPOINT);

export interface ILoadVersionEntrypoint {
  nextGameVersion: GameVersion;
}

export const LOAD_VERSION_ENTRYPOINT = "LOAD_VERSION_ENTRYPOINT";
export const LoadVersionEntrypoint = (payload: ILoadVersionEntrypoint) =>
  createAction(LOAD_VERSION_ENTRYPOINT, payload);

export interface ILoadRegionEntrypoint extends ILoadVersionEntrypoint {
  realms: IGetConnectedRealmsResponseData | null;
  nextRegionName: RegionName;
}

export const LOAD_REGION_ENTRYPOINT = "LOAD_REGION_ENTRYPOINT";
export const LoadRegionEntrypoint = (payload: ILoadRegionEntrypoint) =>
  createAction(LOAD_REGION_ENTRYPOINT, payload);

export interface ILoadRealmEntrypoint extends ILoadRegionEntrypoint {
  nextRealmSlug: RealmSlug;
  nextExpansionName?: ExpansionName;
}

export const LOAD_REALM_ENTRYPOINT = "LOAD_REALM_ENTRYPOINT";
export const LoadRealmEntrypoint = (payload: ILoadRealmEntrypoint) =>
  createAction(LOAD_REALM_ENTRYPOINT, payload);

export const MainActions = {
  ChangeIsLoginDialogOpen,
  ChangeIsRegisterDialogOpen,
  LoadBaseEntrypoint,
  LoadRealmEntrypoint,
  LoadRegionEntrypoint,
  LoadRootEntrypoint,
  LoadVersionEntrypoint,
  RealmChange,
  ReceiveGetConnectedRealms,
  ReceiveGetUserPreferences,
  ReceiveVerifyUser,
  RegionChange,
  RequestGetConnectedRealms,
  RequestGetUserPreferences,
  RequestVerifyUser,
  UserLogin,
  UserRegister,
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MainActions = ActionsUnion<typeof MainActions>;
