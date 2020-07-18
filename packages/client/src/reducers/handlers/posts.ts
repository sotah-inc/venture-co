import {
  IPostJson,
  IQueryAuctionStatsResponseData,
  IValidationErrorResponse,
} from "@sotah-inc/core";

import {
  LoadPostsEntrypoint,
  PostsActions,
  ReceiveCreatePost,
  ReceiveDeletePost,
  ReceiveGetPost,
  ReceiveGetPosts,
  ReceiveUpdatePost,
} from "../../actions/posts";
import { IFetchData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { IPostsState, IRegionTokenHistories } from "../../types/posts";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IPostsState, PostsActions> = {
  entrypoint: {
    posts: {
      load: (state: IPostsState, action: ReturnType<typeof LoadPostsEntrypoint>) => {
        const loadId = action.payload.loadId;

        const posts: IFetchData<IPostJson[]> = (() => {
          if (typeof action.payload.posts.error !== "undefined") {
            return { ...state.posts, level: FetchLevel.failure };
          }

          return { data: action.payload.posts.posts, errors: {}, level: FetchLevel.success };
        })();

        const regionTokenHistories: IFetchData<IRegionTokenHistories> = (() => {
          const error = Object.keys(action.payload.tokenHistories).reduce<string | null>(
            (foundError, v) => {
              if (foundError !== null) {
                return foundError;
              }

              const result = action.payload.tokenHistories[v];

              if (result.history === null) {
                return `History for ${v} was null`;
              }

              return result.error;
            },
            null,
          );
          if (error != null) {
            return { ...state.regionTokenHistories, level: FetchLevel.failure };
          }

          const data = Object.keys(action.payload.tokenHistories).reduce<IRegionTokenHistories>(
            (result, v) => {
              return {
                ...result,
                [v]: action.payload.tokenHistories[v].history!,
              };
            },
            {},
          );

          return { data, errors: {}, level: FetchLevel.success };
        })();

        const auctionStats = ((): IFetchData<IQueryAuctionStatsResponseData> => {
          if (action.payload.auctionStats.error !== null) {
            return { data: {}, level: FetchLevel.failure, errors: {} };
          }

          return {
            data: action.payload.auctionStats.response!,
            errors: {},
            level: FetchLevel.success,
          };
        })();

        return { ...state, loadId, posts, regionTokenHistories, auctionStats };
      },
    },
  },
  post: {
    create: {
      receive: (state: IPostsState, action: ReturnType<typeof ReceiveCreatePost>) => {
        if (action.payload.post === null) {
          const createPostErrors: IValidationErrorResponse = (() => {
            if (typeof action.payload.error !== "undefined") {
              return { error: action.payload.error };
            }

            return action.payload.errors!;
          })();

          return { ...state, createPostLevel: FetchLevel.failure, createPostErrors };
        }

        return {
          ...state,
          createPostErrors: {},
          createPostLevel: FetchLevel.success,
          currentPost: action.payload.post!,
          posts: { ...state.posts, level: FetchLevel.prompted },
        };
      },
      request: (state: IPostsState) => {
        return { ...state, createPostLevel: FetchLevel.fetching };
      },
    },
    delete: {
      receive: (state: IPostsState, action: ReturnType<typeof ReceiveDeletePost>) => {
        if (action.payload === null) {
          return { ...state, deletePostLevel: FetchLevel.failure };
        }

        return {
          ...state,
          currentPost: null,
          deletePostLevel: FetchLevel.success,
          isDeletePostDialogOpen: false,
          posts: { ...state.posts, level: FetchLevel.prompted },
        };
      },
      request: (state: IPostsState) => {
        return { ...state, deletePostLevel: FetchLevel.fetching };
      },
    },
    get: {
      receive: (state: IPostsState, action: ReturnType<typeof ReceiveGetPost>) => {
        if (action.payload === null) {
          return { ...state, getPostLevel: FetchLevel.failure, currentPost: null };
        }

        return { ...state, getPostLevel: FetchLevel.success, currentPost: action.payload.post };
      },
      request: (state: IPostsState) => {
        return { ...state, getPostLevel: FetchLevel.fetching };
      },
    },
    update: {
      receive: (state: IPostsState, action: ReturnType<typeof ReceiveUpdatePost>) => {
        if (action.payload.post === null) {
          const updatePostErrors: IValidationErrorResponse = (() => {
            if (typeof action.payload.error !== "undefined") {
              return { error: action.payload.error };
            }

            return action.payload.errors!;
          })();

          return { ...state, updatePostLevel: FetchLevel.failure, updatePostErrors };
        }

        const postsData = state.posts.data.map(v => {
          if (v.id === action.payload.post!.id) {
            return action.payload.post!;
          }

          return v;
        });

        return {
          ...state,
          currentPost: action.payload.post!,
          posts: { ...state.posts, data: postsData },
          updatePostErrors: {},
          updatePostLevel: FetchLevel.success,
        };
      },
      request: (state: IPostsState) => {
        return { ...state, updatePostLevel: FetchLevel.fetching };
      },
    },
  },
  posts: {
    get: {
      receive: (state: IPostsState, action: ReturnType<typeof ReceiveGetPosts>) => {
        if (typeof action.payload.error !== "undefined") {
          return { ...state, posts: { ...state.posts, level: FetchLevel.failure } };
        }

        return {
          ...state,
          posts: { data: action.payload.posts, errors: {}, level: FetchLevel.success },
        };
      },
      request: (state: IPostsState) => {
        return { ...state, posts: { ...state.posts, level: FetchLevel.fetching } };
      },
    },
  },
};

export const run: Runner<IPostsState, PostsActions> = (
  state: IPostsState,
  action: PostsActions,
): IPostsState => {
  const [kind, verb, task] = action.type
    .split("_")
    .reverse()
    .map(v => v.toLowerCase());
  const taskHandler = handlers[kind]?.[verb]?.[task] ?? null;
  if (taskHandler === null) {
    return state;
  }

  return taskHandler(state, action);
};
