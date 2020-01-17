import { IPostJson, ITokenHistory } from "@sotah-inc/core";

import { IFetchData } from "./global";
import { FetchLevel } from "./main";

export interface IRegionTokenHistories {
  [regionName: string]: ITokenHistory | undefined;
}

export interface IPostsState {
  posts: IFetchData<IPostJson[]>;
  createPostLevel: FetchLevel;
  createPostErrors: {
    [key: string]: string;
  };
  updatePostLevel: FetchLevel;
  updatePostErrors: {
    [key: string]: string;
  };
  currentPost: IPostJson | null;
  getPostLevel: FetchLevel;
  isDeletePostDialogOpen: boolean;
  deletePostLevel: FetchLevel;
  regionTokenHistories: IFetchData<IRegionTokenHistories>;
}

export const defaultPostsState: IPostsState = {
  createPostErrors: {},
  createPostLevel: FetchLevel.initial,
  currentPost: null,
  deletePostLevel: FetchLevel.initial,
  getPostLevel: FetchLevel.initial,
  isDeletePostDialogOpen: false,
  posts: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
  regionTokenHistories: {
    data: {},
    errors: {},
    level: FetchLevel.initial,
  },
  updatePostErrors: {},
  updatePostLevel: FetchLevel.initial,
};
