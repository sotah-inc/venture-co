import { IAuction, ItemId } from "@sotah-inc/core";

import {
  ACTIVESELECT_CHANGE,
  AuctionActions,
  RECEIVE_AUCTIONS,
  RECEIVE_QUERYAUCTIONS,
  REQUEST_AUCTIONS,
  REQUEST_QUERYAUCTIONS,
  SELECT_ITEM_QUERYAUCTIONS,
  SET_CURRENTPAGE_QUERYAUCTIONS,
  SET_PERPAGE_QUERYAUCTIONS,
  SET_SORT_QUERYAUCTIONS,
} from "../actions/auction";
import { defaultAuctionState, IAuctionState } from "../types/auction";
import { FetchLevel } from "../types/main";
import { runners } from "./handlers";

type State = Readonly<IAuctionState>;

export const auction = (state: State | undefined, action: AuctionActions): State => {
  if (typeof state === "undefined") {
    return defaultAuctionState;
  }

  switch (action.type) {
    case REQUEST_AUCTIONS:
      const requestAuctionsLevel =
        state.auctionsResult.level === FetchLevel.initial
          ? FetchLevel.fetching
          : FetchLevel.refetching;

      return {
        ...state,
        auctionsResult: { ...state.auctionsResult, level: requestAuctionsLevel },
      };
    case RECEIVE_AUCTIONS:
      if (action.payload === null) {
        return { ...state, auctionsResult: { ...state.auctionsResult, level: FetchLevel.failure } };
      }

      const auctions: IAuction[] = (() => {
        if (action.payload.auctions === null) {
          return [];
        }

        return action.payload.auctions;
      })();

      return {
        ...state,
        auctionsResult: {
          ...state.auctionsResult,
          data: {
            data: auctions,
            items: action.payload.items,
          },
          level: FetchLevel.success,
        },
        relatedProfessionPricelists: action.payload.professionPricelists,
        totalResults: action.payload.total,
      };
    case SET_CURRENTPAGE_QUERYAUCTIONS:
      return { ...state, options: { ...state.options, currentPage: action.payload } };
    case SET_PERPAGE_QUERYAUCTIONS:
      return {
        ...state,
        options: {
          ...state.options,
          auctionsPerPage: action.payload,
          currentPage: defaultAuctionState.options.currentPage,
        },
      };
    case SET_SORT_QUERYAUCTIONS:
      return {
        ...state,
        options: {
          ...state.options,
          currentPage: defaultAuctionState.options.currentPage,
          ...action.payload,
        },
      };
    case REQUEST_QUERYAUCTIONS:
      const requestAuctionsQueryLevel =
        state.options.queryAuctions.results.level === FetchLevel.initial
          ? FetchLevel.fetching
          : FetchLevel.refetching;

      return {
        ...state,
        options: {
          ...state.options,
          queryAuctions: {
            ...state.options.queryAuctions,
            results: { ...state.options.queryAuctions.results, level: requestAuctionsQueryLevel },
          },
        },
      };
    case RECEIVE_QUERYAUCTIONS:
      if (action.payload === null) {
        return {
          ...state,
          options: {
            ...state.options,
            queryAuctions: {
              ...state.options.queryAuctions,
              results: {
                ...state.options.queryAuctions.results,
                level: FetchLevel.failure,
              },
            },
          },
        };
      }

      return {
        ...state,
        options: {
          ...state.options,
          queryAuctions: {
            ...state.options.queryAuctions,
            results: {
              ...state.options.queryAuctions.results,
              data: action.payload.items,
              level: FetchLevel.success,
            },
          },
        },
      };
    case SELECT_ITEM_QUERYAUCTIONS:
      const nextSelected: ItemId[] = (() => {
        if (!state.options.queryAuctions.selected.includes(action.payload)) {
          return [...state.options.queryAuctions.selected, action.payload];
        }

        const result = new Set(state.options.queryAuctions.selected);
        result.delete(action.payload);

        return Array.from(result.values());
      })();

      return {
        ...state,
        options: {
          ...state.options,
          queryAuctions: {
            ...state.options.queryAuctions,
            selected: nextSelected,
          },
        },
      };
    case ACTIVESELECT_CHANGE:
      return { ...state, activeSelect: action.payload };
    default:
      return runners.auction(state, action);
  }
};
