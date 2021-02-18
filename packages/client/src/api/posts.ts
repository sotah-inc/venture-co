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
import { getApiEndpoint } from "./config";
import { gather } from "./gather";

export interface ICreatePostResult {
  post: IPostJson | null;
  error?: string;
  errors?: IErrors;
}

export async function createPost(
  token: string,
  request: ICreatePostRequest,
): Promise<ICreatePostResult> {
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
}

export interface IUpdatePostResult {
  post: IPostJson | null;
  error?: string;
  errors?: IErrors;
}

export async function updatePost(
  token: string,
  id: number,
  request: UpdatePostRequest,
): Promise<IUpdatePostResult> {
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
}

export async function getPost(slug: string): Promise<IGetPostResponseData | null> {
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
}

export async function deletePost(token: string, id: number): Promise<number | null> {
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
}

export interface IGetPostsResult {
  posts: IPostJson[];
  error?: string;
}

export async function getPosts(): Promise<IGetPostsResult> {
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

  if (body === null) {
    return { posts: [], error: "Empty body" };
  }

  return { posts: body.posts };
}
