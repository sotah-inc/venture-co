import {
  CreatePostResponse,
  GetPostResponse,
  GetPostsResponse,
  ICreatePostRequest,
  ICreatePostResponseData,
  IGetPostResponseData,
  IPostJson,
  IValidationErrorResponse,
  UpdatePostRequest,
  UpdatePostResponse,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { IErrors } from "../types/global";
import { gather, getApiEndpoint } from "./index";

export interface ICreatePostResult {
  post: IPostJson | null;
  error?: string;
  errors?: IErrors;
}

export const createPost = async (
  token: string,
  request: ICreatePostRequest,
): Promise<ICreatePostResult> => {
  const { body, status } = await gather<ICreatePostRequest, CreatePostResponse>({
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

  return { post: (body as ICreatePostResponseData).post };
};

export interface IUpdatePostResult {
  post: IPostJson | null;
  error?: string;
  errors?: IErrors;
}

export const updatePost = async (
  token: string,
  id: number,
  request: UpdatePostRequest,
): Promise<IUpdatePostResult> => {
  const { body, status } = await gather<UpdatePostRequest, UpdatePostResponse>({
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

  return { post: (body as ICreatePostResponseData).post };
};

export const getPost = async (slug: string): Promise<IGetPostResponseData | null> => {
  const { body, status } = await gather<null, GetPostResponse>({
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

  return { post: (body as IGetPostResponseData).post };
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

export interface IGetPostsResult {
  posts: IPostJson[];
  error?: string;
}

export const getPosts = async (): Promise<IGetPostsResult> => {
  const { body, status } = await gather<null, GetPostsResponse>({
    headers: new Headers({ "content-type": "application/json" }),
    method: "GET",
    url: `${getApiEndpoint()}/posts`,
  });

  switch (status) {
    case HTTPStatus.OK:
      break;
    default:
      return { posts: [], error: "Failure" };
  }

  return { posts: body!.posts };
};
