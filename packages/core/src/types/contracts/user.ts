import { IUserJson } from "../entities";

import { IValidationErrorResponse } from "./index";

export interface ICreateUserRequest {
  email: string;
  password: string;
}

export interface ICreateUserResponseData {
  token: string;
  user: IUserJson;
}

export type CreateUserResponse = ICreateUserResponseData | IValidationErrorResponse;

export interface IVerifyUserResponseData {
  destination: string;
}

export type VerifyUserResponse = IVerifyUserResponseData | IValidationErrorResponse;
