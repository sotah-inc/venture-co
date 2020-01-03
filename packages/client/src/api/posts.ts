import {
  ICreatePostRequest,
  ICreatePostResponse,
  IErrorResponse,
  IGetPostResponse,
  IPostJson,
  IUpdatePostRequest,
  IUpdatePostResponse,
  IValidationErrorResponse,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint, gather } from "./index";

export interface ICreatePostResult {
  post: IPostJson | null;
  error?: string;
  errors?: {
    [key: string]: string;
  };
}

export const createPost = async (
  token: string,
  request: ICreatePostRequest,
): Promise<ICreatePostResult> => {
  const { body, status } = await gather<
    ICreatePostRequest,
    ICreatePostResponse | IErrorResponse | IValidationErrorResponse
  >({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "POST",
    url: `${getApiEndpoint()}/user/posts`,
  });
  if (status === HTTPStatus.UNAUTHORIZED) {
    return { error: "Unauthorized", post: null };
  }
  switch (status) {
    case HTTPStatus.CREATED:
      break;
    case HTTPStatus.UNAUTHORIZED:
      return { error: "Unauthorized", post: null };
    case HTTPStatus.BAD_REQUEST:
      return { errors: body as IValidationErrorResponse, post: null };
    default:
      return { error: "Failure", post: null };
  }

  return { post: (body as ICreatePostResponse).post };
};

export interface IUpdatePostResult {
  post: IPostJson | null;
  error?: string;
  errors?: {
    [key: string]: string;
  };
}

export const updatePost = async (
  token: string,
  id: number,
  request: IUpdatePostRequest,
): Promise<IUpdatePostResult> => {
  const { body, status } = await gather<
    IUpdatePostRequest,
    IUpdatePostResponse | IErrorResponse | IValidationErrorResponse
  >({
    body: request,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "PUT",
    url: `${getApiEndpoint()}/user/posts/${id}`,
  });
  if (status === HTTPStatus.UNAUTHORIZED) {
    return { error: "Unauthorized", post: null };
  }
  switch (status) {
    case HTTPStatus.OK:
      break;
    case HTTPStatus.UNAUTHORIZED:
      return { error: "Unauthorized", post: null };
    case HTTPStatus.BAD_REQUEST:
      return { errors: body as IValidationErrorResponse, post: null };
    default:
      return { error: "Failure", post: null };
  }

  return { post: (body as IUpdatePostResponse).post };
};

export const getPost = async (slug: string): Promise<IGetPostResponse | null> => {
  const { body, status } = await gather<null, IGetPostResponse | IErrorResponse>({
    headers: new Headers({
      "content-type": "application/json",
    }),
    url: `${getApiEndpoint()}/posts/${slug}`,
  });
  switch (status) {
    case HTTPStatus.OK:
      break;
    default:
      return null;
  }

  return { post: (body as IGetPostResponse).post };
};

export const deletePost = async (token: string, id: number): Promise<number | null> => {
  const { status } = await gather<null, null>({
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    }),
    method: "DELETE",
    url: `${getApiEndpoint()}/user/posts/${id}`,
  });
  switch (status) {
    case HTTPStatus.OK:
      return id;
    default:
      return null;
  }
};
