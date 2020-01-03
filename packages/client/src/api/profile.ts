import {
  IUpdateProfileRequest,
  IUpdateProfileResponse,
  IValidationErrorResponse,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { IErrors } from "../types/global";

import { getApiEndpoint, gather } from "./index";

export interface IUpdateProfileResult {
  email: string | null;
  error?: string;
  errors?: IErrors;
}

export const updateProfile = async (
  token: string,
  request: IUpdateProfileRequest,
): Promise<IUpdateProfileResult> => {
  const { body, status } = await gather<
    IUpdateProfileRequest,
    IUpdateProfileResponse | IValidationErrorResponse
  >({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "PUT",
    url: `${getApiEndpoint()}/user/profile`,
  });
  if (status === HTTPStatus.UNAUTHORIZED) {
    return { error: "Unauthorized", email: null };
  }
  switch (status) {
    case HTTPStatus.OK:
      break;
    case HTTPStatus.UNAUTHORIZED:
      return { error: "Unauthorized", email: null };
    case HTTPStatus.BAD_REQUEST:
      return { errors: body as IValidationErrorResponse, email: null };
    default:
      return { error: "Failure", email: null };
  }

  return { email: body!.email };
};
