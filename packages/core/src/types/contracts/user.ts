import { IUserJson } from "../entities";

import { IValidationErrorResponse } from "./index";

export interface ICreateUserRequest {
  firebaseAuthToken: string;
}

export interface ICreateUserResponseData {
  token: string;
  user: IUserJson;
}

export type CreateUserResponse = ICreateUserResponseData | IValidationErrorResponse;
