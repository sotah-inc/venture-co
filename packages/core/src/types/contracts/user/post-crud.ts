import { IPostJson } from "../../entities";
import { IValidationErrorResponse } from "../index";

export interface ICreatePostRequest {
  title: string;
  slug: string;
  summary: string;
  body: string;
}

export interface ICreatePostResponseData {
  post: IPostJson;
}

export type CreatePostResponse = ICreatePostResponseData | IValidationErrorResponse;

export type UpdatePostRequest = ICreatePostRequest;

export type UpdatePostResponse = CreatePostResponse;

export type DeletePostResponse = IValidationErrorResponse | null;
