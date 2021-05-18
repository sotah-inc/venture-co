/* eslint-disable func-style,@typescript-eslint/explicit-module-boundary-types */
import {
  IConnectedRealmComposite,
  ICreatePreferencesRequest,
  IGetBootResponseData,
  IGetItemClassesResponseData,
  IRegionComposite,
  RealmSlug,
  RegionName,
  UpdatePreferencesRequest,
} from "@sotah-inc/core";
import { Dispatch } from "redux";

import { getBoot, getConnectedRealms, getItemClasses, getPing } from "../api/data";
import {
  createPreferences,
  getPreferences,
  ICreatePreferencesResult,
  IGetPreferencesResult,
  IReloadUserResponse,
  IUpdatePreferencesResult,
  reloadUser,
  updatePreferences,
  verifyUser,
  VerifyUserResult,
} from "../api/user";
import { IClientRealm, IProfile } from "../types/global";
import { AuthLevel } from "../types/main";
import { ActionsUnion, createAction } from "./helpers";

export const REQUEST_GET_PING = "REQUEST_GET_PING";
export const RECEIVE_GET_PING = "RECEIVE_GET_PING";
export const RequestGetPing = () => createAction(REQUEST_GET_PING);
export const ReceiveGetPing = (payload: boolean) => createAction(RECEIVE_GET_PING, payload);
type FetchGetPingType = ReturnType<typeof RequestGetPing | typeof ReceiveGetPing>;
export const FetchGetPing = () => {
  return async (dispatch: Dispatch<FetchGetPingType>) => {
    dispatch(RequestGetPing());
    dispatch(ReceiveGetPing(await getPing()));
  };
};

export const USER_REGISTER = "USER_REGISTER";
export const UserRegister = (payload: IProfile) => createAction(USER_REGISTER, payload);

export const USER_LOGIN = "USER_LOGIN";
export const UserLogin = (payload: IProfile) => createAction(USER_LOGIN, payload);

export const REQUEST_USER_RELOAD = "REQUEST_USER_RELOAD";
export const RECEIVE_USER_RELOAD = "RECEIVE_USER_RELOAD";
const RequestUserReload = () => createAction(REQUEST_USER_RELOAD);
const ReceiveUserReload = (payload: IReloadUserResponse) =>
  createAction(RECEIVE_USER_RELOAD, payload);
type FetchUserReloadType = ReturnType<typeof RequestUserReload | typeof ReceiveUserReload>;
export const FetchUserReload = (token: string) => {
  return async (dispatch: Dispatch<FetchUserReloadType>) => {
    dispatch(RequestUserReload());
    dispatch(ReceiveUserReload(await reloadUser(token)));
  };
};

export const CHANGE_AUTH_LEVEL = "CHANGE_AUTH_LEVEL";
export const ChangeAuthLevel = (payload: AuthLevel) => createAction(CHANGE_AUTH_LEVEL, payload);

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

export const REQUEST_GET_BOOT = "REQUEST_GET_BOOT";
export const RECEIVE_GET_BOOT = "RECEIVE_GET_BOOT";
export const RequestGetBoot = () => createAction(REQUEST_GET_BOOT);
export const ReceiveGetBoot = (payload: IGetBootResponseData | null) =>
  createAction(RECEIVE_GET_BOOT, payload);
type FetchGetBootType = ReturnType<typeof RequestGetBoot | typeof ReceiveGetBoot>;
export const FetchGetBoot = () => {
  return async (dispatch: Dispatch<FetchGetBootType>) => {
    dispatch(RequestGetBoot());
    dispatch(ReceiveGetBoot(await getBoot()));
  };
};

export const REQUEST_GET_ITEMCLASSES = "REQUEST_GET_ITEMCLASSES";
export const RECEIVE_GET_ITEMCLASSES = "RECEIVE_GET_ITEMCLASSES";
export const RequestGetItemClasses = () => createAction(REQUEST_GET_ITEMCLASSES);
export const ReceiveGetItemClasses = (payload: IGetItemClassesResponseData | null) =>
  createAction(RECEIVE_GET_ITEMCLASSES, payload);
type FetchGetItemClassesType = ReturnType<
  typeof RequestGetItemClasses | typeof ReceiveGetItemClasses
>;
export const FetchGetItemClasses = () => {
  return async (dispatch: Dispatch<FetchGetItemClassesType>) => {
    dispatch(RequestGetItemClasses());
    dispatch(ReceiveGetItemClasses(await getItemClasses()));
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
export const RegionChange = (payload: IRegionComposite) => createAction(REGION_CHANGE, payload);

export const REQUEST_GET_CONNECTEDREALMS = "REQUEST_GET_CONNECTEDREALMS";
export const RECEIVE_GET_CONNECTEDREALMS = "RECEIVE_GET_CONNECTEDREALMS";
export const RequestGetConnectedRealms = () => createAction(REQUEST_GET_CONNECTEDREALMS);
export const ReceiveGetConnectedRealms = (payload: IConnectedRealmComposite[] | null) =>
  createAction(RECEIVE_GET_CONNECTEDREALMS, payload);
type FetchGetConnectedRealmsType = ReturnType<
  typeof RequestGetConnectedRealms | typeof ReceiveGetConnectedRealms
>;
export const FetchGetConnectedRealms = (region: IRegionComposite) => {
  return async (dispatch: Dispatch<FetchGetConnectedRealmsType>) => {
    dispatch(RequestGetConnectedRealms());
    dispatch(ReceiveGetConnectedRealms(await getConnectedRealms(region.config_region.name)));
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
  boot: IGetBootResponseData | null;
  itemClasses: IGetItemClassesResponseData | null;
  ping: boolean;
}

export const LOAD_ROOT_ENTRYPOINT = "LOAD_ROOT_ENTRYPOINT";
export const LoadRootEntrypoint = (payload: ILoadRootEntrypoint) =>
  createAction(LOAD_ROOT_ENTRYPOINT, payload);

export interface ILoadRegionEntrypoint {
  realms: IConnectedRealmComposite[] | null;
  nextRegionName: RegionName;
}

export const LOAD_REGION_ENTRYPOINT = "LOAD_REGION_ENTRYPOINT";
export const LoadRegionEntrypoint = (payload: ILoadRegionEntrypoint) =>
  createAction(LOAD_REGION_ENTRYPOINT, payload);

export interface ILoadRealmEntrypoint {
  realms: IConnectedRealmComposite[] | null;
  nextRegionName: RegionName;
  nextRealmSlug: RealmSlug;
}

export const LOAD_REALM_ENTRYPOINT = "LOAD_REALM_ENTRYPOINT";
export const LoadRealmEntrypoint = (payload: ILoadRealmEntrypoint) =>
  createAction(LOAD_REALM_ENTRYPOINT, payload);

export const MainActions = {
  ChangeAuthLevel,
  ChangeIsLoginDialogOpen,
  ChangeIsRegisterDialogOpen,
  LoadRealmEntrypoint,
  LoadRegionEntrypoint,
  LoadRootEntrypoint,
  RealmChange,
  ReceiveGetBoot,
  ReceiveGetConnectedRealms,
  ReceiveGetItemClasses,
  ReceiveGetPing,
  ReceiveGetUserPreferences,
  ReceiveUserReload,
  ReceiveVerifyUser,
  RegionChange,
  RequestGetBoot,
  RequestGetConnectedRealms,
  RequestGetItemClasses,
  RequestGetPing,
  RequestGetUserPreferences,
  RequestUserReload,
  RequestVerifyUser,
  UserLogin,
  UserRegister,
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MainActions = ActionsUnion<typeof MainActions>;
