import { IAuction } from "@sotah-inc/core";

import {
  ACTIVESELECT_CHANGE,
  AuctionActions,
  RECEIVE_AUCTIONS,
  REQUEST_AUCTIONS,
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
            auctions,
            items: action.payload.items,
            pets: action.payload.pets,
          },
          level: FetchLevel.success,
        },
        relatedProfessionPricelists: action.payload.professionPricelists,
        totalResults: action.payload.total,
      };
    case ACTIVESELECT_CHANGE:
      return { ...state, activeSelect: action.payload };
    default:
      return runners.auction(state, action);
  }
};
