import {
  ICreatePostRequest,
  IGetPostResponseData,
  IPostJson,
  UpdatePostRequest,
} from "@sotah-inc/core";
import { Dispatch } from "redux";

import { IQueryAuctionStatsResult } from "../api/auctions";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  ICreatePostResult,
  IGetPostsResult,
  IUpdatePostResult,
  updatePost,
} from "../api/posts";
import { IGetShortTokenHistoryResult } from "../api/token-history";
import { ActionsUnion, createAction } from "./helpers";

export const REQUEST_CREATE_POST = "REQUEST_CREATE_POST";
export const RECEIVE_CREATE_POST = "RECEIVE_CREATE_POST";
export const RequestCreatePost = () => createAction(REQUEST_CREATE_POST);
export const ReceiveCreatePost = (payload: ICreatePostResult) =>
  createAction(RECEIVE_CREATE_POST, payload);
type FetchCreatePostType = ReturnType<typeof RequestCreatePost | typeof ReceiveCreatePost>;
export const FetchCreatePost = (token: string, request: ICreatePostRequest) => {
  return async (dispatch: Dispatch<FetchCreatePostType>) => {
    dispatch(RequestCreatePost());
    dispatch(ReceiveCreatePost(await createPost(token, request)));
  };
};

export const REQUEST_UPDATE_POST = "REQUEST_UPDATE_POST";
export const RECEIVE_UPDATE_POST = "RECEIVE_UPDATE_POST";
export const RequestUpdatePost = () => createAction(REQUEST_UPDATE_POST);
export const ReceiveUpdatePost = (payload: IUpdatePostResult) =>
  createAction(RECEIVE_UPDATE_POST, payload);
type FetchUpdatePostType = ReturnType<typeof RequestUpdatePost | typeof ReceiveUpdatePost>;
export const FetchUpdatePost = (token: string, id: number, request: UpdatePostRequest) => {
  return async (dispatch: Dispatch<FetchUpdatePostType>) => {
    dispatch(RequestUpdatePost());
    dispatch(ReceiveUpdatePost(await updatePost(token, id, request)));
  };
};

export const REQUEST_GET_POSTS = "REQUEST_GET_POSTS";
export const RECEIVE_GET_POSTS = "RECEIVE_GET_POSTS";
export const RequestGetPosts = () => createAction(REQUEST_GET_POSTS);
export const ReceiveGetPosts = (payload: IGetPostsResult) =>
  createAction(RECEIVE_GET_POSTS, payload);
type FetchGetPostsType = ReturnType<typeof RequestGetPosts | typeof ReceiveGetPosts>;
export const FetchGetPosts = () => {
  return async (dispatch: Dispatch<FetchGetPostsType>) => {
    dispatch(RequestGetPosts());
    dispatch(ReceiveGetPosts(await getPosts()));
  };
};

export const REQUEST_GET_POST = "REQUEST_GET_POST";
export const RECEIVE_GET_POST = "RECEIVE_GET_POST";
export const RequestGetPost = () => createAction(REQUEST_GET_POST);
export const ReceiveGetPost = (payload: IGetPostResponseData | null) =>
  createAction(RECEIVE_GET_POST, payload);
type FetchGetPostType = ReturnType<typeof RequestGetPost | typeof ReceiveGetPost>;
export const FetchGetPost = (slug: string) => {
  return async (dispatch: Dispatch<FetchGetPostType>) => {
    dispatch(RequestGetPost());
    dispatch(ReceiveGetPost(await getPost(slug)));
  };
};

export const REQUEST_DELETE_POST = "REQUEST_DELETE_POST";
export const RECEIVE_DELETE_POST = "RECEIVE_DELETE_POST";
export const RequestDeletePost = () => createAction(REQUEST_DELETE_POST);
export const ReceiveDeletePost = (payload: number | null) =>
  createAction(RECEIVE_DELETE_POST, payload);
type FetchDeletePostType = ReturnType<typeof RequestDeletePost | typeof ReceiveDeletePost>;
export const FetchDeletePost = (token: string, id: number) => {
  return async (dispatch: Dispatch<FetchDeletePostType>) => {
    dispatch(RequestDeletePost());
    dispatch(ReceiveDeletePost(await deletePost(token, id)));
  };
};

export const CHANGE_POST = "CHANGE_POST";
export const ChangePost = (payload: IPostJson) => createAction(CHANGE_POST, payload);

export interface IDeletePostOptions {
  isOpen: boolean;
  post: IPostJson;
}

export const CHANGE_IS_DELETE_POST_DIALOG_OPEN = "CHANGE_IS_DELETE_POST_DIALOG_OPEN";
export const ChangeIsDeletePostDialogOpen = (payload: IDeletePostOptions) =>
  createAction(CHANGE_IS_DELETE_POST_DIALOG_OPEN, payload);

export interface ILoadPostsEntrypoint {
  posts: IGetPostsResult;
  tokenHistories: IGetShortTokenHistoryResult;
  auctionStats: IQueryAuctionStatsResult;
}

export const LOAD_POSTS_ENTRYPOINT = "LOAD_POSTS_ENTRYPOINT";
export const LoadPostsEntrypoint = (payload: ILoadPostsEntrypoint) =>
  createAction(LOAD_POSTS_ENTRYPOINT, payload);

export const PostsActions = {
  ChangeIsDeletePostDialogOpen,
  ChangePost,
  LoadPostsEntrypoint,
  ReceiveCreatePost,
  ReceiveDeletePost,
  ReceiveGetPost,
  ReceiveGetPosts,
  ReceiveUpdatePost,
  RequestCreatePost,
  RequestDeletePost,
  RequestGetPost,
  RequestGetPosts,
  RequestUpdatePost,
};

export type PostsActions = ActionsUnion<typeof PostsActions>;
