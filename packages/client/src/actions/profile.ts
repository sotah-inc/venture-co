/* eslint-disable func-style,@typescript-eslint/explicit-module-boundary-types */
import { IUpdateProfileRequest } from "@sotah-inc/core";
import { Dispatch } from "redux";

import { IUpdateProfileResult, updateProfile } from "../api/profile";
import { ActionsUnion, createAction } from "./helpers";

export const REQUEST_UPDATE_PROFILE = "REQUEST_UPDATE_PROFILE";
export const RECEIVE_UPDATE_PROFILE = "RECEIVE_UPDATE_PROFILE";
export const RequestUpdateProfile = () => createAction(REQUEST_UPDATE_PROFILE);
export const ReceiveUpdateProfile = (payload: IUpdateProfileResult) =>
  createAction(RECEIVE_UPDATE_PROFILE, payload);
type FetchUpdateProfileType = ReturnType<typeof RequestUpdateProfile | typeof ReceiveUpdateProfile>;
export const FetchUpdateProfile = (token: string, request: IUpdateProfileRequest) => {
  return async (dispatch: Dispatch<FetchUpdateProfileType>) => {
    dispatch(RequestUpdateProfile());
    dispatch(ReceiveUpdateProfile(await updateProfile(token, request)));
  };
};

export const ProfileActions = {
  ReceiveUpdateProfile,
  RequestUpdateProfile,
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ProfileActions = ActionsUnion<typeof ProfileActions>;
