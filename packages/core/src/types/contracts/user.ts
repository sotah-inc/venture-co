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

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponseData {
  token: string;
  user: IUserJson;
}

export type LoginResponse = ILoginResponseData | IValidationErrorResponse;
