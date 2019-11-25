import { IAuction } from "@sotah-inc/core";

import { AuctionActions } from "../../actions";
import { LoadAuctionListEntrypoint } from "../../actions/auction";
import { IAuctionState } from "../../types/auction";
import { FetchLevel } from "../../types/main";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IAuctionState, AuctionActions> = {
  entrypoint: {
    auctionlist: {
      load: (state: IAuctionState, action: ReturnType<typeof LoadAuctionListEntrypoint>) => {
        if (action.payload.auctions === null) {
          return { ...state, fetchAuctionsLevel: FetchLevel.failure };
        }

        const auctions: IAuction[] = (() => {
          if (action.payload.auctions.auctions === null) {
            return [];
          }

          return action.payload.auctions.auctions;
        })();

        if (action.payload.auctionsQuery === null) {
          return { ...state, queryAuctionsLevel: FetchLevel.failure };
        }

        return {
          ...state,
          auctions,
          fetchAuctionsLevel: FetchLevel.success,
          items: action.payload.auctions.items,
          queryAuctionResults: action.payload.auctionsQuery.items,
          queryAuctionsLevel: FetchLevel.success,
          relatedProfessionPricelists: action.payload.auctions.professionPricelists,
          totalResults: action.payload.auctions.total,
        };
      },
    },
  },
};

export const run: Runner<IAuctionState, AuctionActions> = (
  state: IAuctionState,
  action: AuctionActions,
): IAuctionState => {
  const [kind, verb, task] = action.type
    .split("_")
    .reverse()
    .map(v => v.toLowerCase());
  if (!(kind in handlers)) {
    return state;
  }
  const kindHandlers = handlers[kind];

  if (!(verb in kindHandlers)) {
    return state;
  }
  const verbHandlers = kindHandlers[verb];

  if (!(task in verbHandlers)) {
    return state;
  }
  const taskHandler = verbHandlers[task];

  return taskHandler(state, action);
};
