import {
  CreatePreferencesResponse,
  CreateUserResponse,
  ICreatePreferencesRequest,
  ICreateUserRequest,
  ICreateUserResponseData,
  IGetPreferencesResponseData,
  IPreferenceJson,
  ISaveLastPathRequest,
  IUserJson,
  IValidationErrorResponse,
  IVerifyUserResponseData,
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
  VerifyUserResponse,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint, getPrivateApiEndpoint } from "./config";
import { gather } from "./gather";

interface IRegisterUserResult {
  data: ICreateUserResponseData | null;
  errors: IValidationErrorResponse | null;
}

export async function registerUser(email: string, password: string): Promise<IRegisterUserResult> {
  const { body, status } = await gather<ICreateUserRequest, CreateUserResponse>({
    body: { email, password },
    method: "POST",
    url: `${getApiEndpoint()}/users`,
  });
  switch (status) {
  case HTTPStatus.CREATED:
    return { errors: null, data: body as ICreateUserResponseData };
  case HTTPStatus.BAD_REQUEST:
    return { errors: body as IValidationErrorResponse, data: null };
  case HTTPStatus.INTERNAL_SERVER_ERROR:
    return { errors: { email: "There was a server error." }, data: null };
  default:
    return { errors: { email: "There was an unknown error." }, data: null };
  }
}

export enum VerifyUserCode {
  Ok,
  Error,
  AlreadyVerified,
}

export type VerifyUserResult =
  | {
      code: VerifyUserCode.Ok;
      destination: string;
    }
  | {
      code: VerifyUserCode.Error;
      errors: IValidationErrorResponse;
    }
  | {
      code: VerifyUserCode.AlreadyVerified;
    };

export async function verifyUser(token: string): Promise<VerifyUserResult> {
  const { body, status } = await gather<null, VerifyUserResponse>({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "POST",
    url: `${getApiEndpoint()}/user/verify`,
  });
  switch (status) {
  case HTTPStatus.UNAUTHORIZED:
  case HTTPStatus.BAD_REQUEST:
    return { code: VerifyUserCode.Error, errors: body as IValidationErrorResponse };
  case HTTPStatus.INTERNAL_SERVER_ERROR:
    return { code: VerifyUserCode.Error, errors: { email: "There was a server error." } };
  case HTTPStatus.OK:
    return {
      code: VerifyUserCode.Ok,
      destination: (body as IVerifyUserResponseData).destination,
    };
  case HTTPStatus.NO_CONTENT:
    return {
      code: VerifyUserCode.AlreadyVerified,
    };
  default:
    return { code: VerifyUserCode.Error, errors: { email: "There was an unknown error." } };
  }
}

export interface IVerifyUserConfirmResult {
  errors: IValidationErrorResponse | null;
}

export async function verifyUserConfirm(token: string): Promise<IVerifyUserConfirmResult> {
  const { body, status } = await gather<null, IValidationErrorResponse>({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "POST",
    url: `${getApiEndpoint()}/user/verify-confirm`,
  });
  switch (status) {
  case HTTPStatus.UNAUTHORIZED:
  case HTTPStatus.BAD_REQUEST:
    return { errors: body as IValidationErrorResponse };
  case HTTPStatus.INTERNAL_SERVER_ERROR:
    return { errors: { email: "There was a server error." } };
  case HTTPStatus.OK:
    return {
      errors: null,
    };
  default:
    return { errors: { email: "There was an unknown error." } };
  }
}

export interface IReloadUserResponse {
  user: IUserJson | null;
  error: string | null;
}

export async function reloadUser(token: string): Promise<IReloadUserResponse> {
  const { body, status } = await gather<null, IUserJson | IValidationErrorResponse>({
    url: `${getApiEndpoint()}/user`,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "GET",
  });
  switch (status) {
  case HTTPStatus.OK:
    break;
  case HTTPStatus.UNAUTHORIZED:
  default: {
    const error = Object.values(body as IValidationErrorResponse).find(v => !!v);

    return { error: error ?? "Unauthorized", user: null };
  }
  }

  return { user: body as IUserJson, error: null };
}

export interface IGetPreferencesResult {
  preference: IPreferenceJson | null;
  error: string | null;
}

export async function getPreferences(token: string): Promise<IGetPreferencesResult> {
  const { body, status } = await gather<null, IGetPreferencesResponseData>({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    url: `${getApiEndpoint()}/user/preferences`,
  });
  switch (status) {
  case HTTPStatus.UNAUTHORIZED:
    return { error: "Unauthorized", preference: null };
  case HTTPStatus.NOT_FOUND:
    return { error: null, preference: null };
  default:
    break;
  }

  if (body === null) {
    return { error: "Empty body", preference: null };
  }

  return { preference: body.preference, error: null };
}

export interface ICreatePreferencesResult {
  preference: IPreferenceJson | null;
  error: string | null;
}

export async function createPreferences(
  token: string,
  request: ICreatePreferencesRequest,
): Promise<ICreatePreferencesResult> {
  const { body, status } = await gather<ICreatePreferencesRequest, CreatePreferencesResponse>({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "POST",
    url: `${getApiEndpoint()}/user/preferences`,
  });
  if (status === HTTPStatus.UNAUTHORIZED) {
    return { error: "Unauthorized", preference: null };
  }

  return { preference: (body as IGetPreferencesResponseData).preference, error: null };
}

export interface IUpdatePreferencesResult {
  data: IPreferenceJson | null;
  error: string | null;
}

export async function updatePreferences(
  token: string,
  request: UpdatePreferencesRequest,
): Promise<IUpdatePreferencesResult> {
  const { body, status } = await gather<UpdatePreferencesRequest, UpdatePreferencesResponse>({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "PUT",
    url: `${getApiEndpoint()}/user/preferences`,
  });
  if (status === HTTPStatus.UNAUTHORIZED) {
    return { error: "Unauthorized", data: null };
  }

  return { data: (body as IGetPreferencesResponseData).preference, error: null };
}

export async function saveLastPath(
  token: string,
  request: ISaveLastPathRequest,
): Promise<void | null> {
  const privateApiEndpoint = getPrivateApiEndpoint();
  if (privateApiEndpoint === null) {
    return null;
  }

  const { status } = await gather<ISaveLastPathRequest, null>({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "POST",
    url: `${privateApiEndpoint}/user/last-path`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return;
}
