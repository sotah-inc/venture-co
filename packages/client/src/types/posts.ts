import {
  IPostJson,
  IQueryAuctionStatsResponseData,
  IRegionTokenHistory,
  IShortTokenHistory,
} from "@sotah-inc/core";

import { IErrors, IFetchData } from "./global";
import { FetchLevel } from "./main";

export interface IRegionTokenHistories {
  [regionName: string]: IRegionTokenHistory | undefined;
}

export interface IPostsState {
  posts: IFetchData<IPostJson[]>;
  createPostLevel: FetchLevel;
  createPostErrors: IErrors;
  updatePostLevel: FetchLevel;
  updatePostErrors: IErrors;
  currentPost: IPostJson | null;
  getPostLevel: FetchLevel;
  isDeletePostDialogOpen: boolean;
  deletePostLevel: FetchLevel;
  regionTokenHistories: IFetchData<IRegionTokenHistories>;
  tokenHistories: IFetchData<IShortTokenHistory>;
  auctionStats: IFetchData<IQueryAuctionStatsResponseData>;
}

export const defaultPostsState: IPostsState = {
  auctionStats: {
    data: {},
    errors: {},
    level: FetchLevel.initial,
  },
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
  tokenHistories: {
    data: {},
    errors: {},
    level: FetchLevel.initial,
  },
  updatePostErrors: {},
  updatePostLevel: FetchLevel.initial,
};
