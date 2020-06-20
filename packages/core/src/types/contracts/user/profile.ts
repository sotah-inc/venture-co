import { IValidationErrorResponse } from "../index";

export interface IUpdateProfileRequest {
  email: string;
}

export interface IUpdateProfileResponseData {
  email: string;
}

export type UpdateProfileResponse = IUpdateProfileResponseData | IValidationErrorResponse;
