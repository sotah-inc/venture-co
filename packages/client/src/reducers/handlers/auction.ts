import { IAuction, IItem } from "@sotah-inc/core";

import { AuctionActions } from "../../actions";
import {
  LoadAuctionListEntrypoint,
  SelectItemQueryAuctions,
  SetCurrentPageQueryAuctions,
  SetPerPageQueryAuctions,
  SetSortQueryAuctions,
} from "../../actions/auction";
import { defaultAuctionState, IAuctionState } from "../../types/auction";
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

        if (action.payload.querySelected === null) {
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
          auctionsResult: {
            ...state.auctionsResult,
            data: {
              data: auctions,
              items: action.payload.auctions.items,
            },
            level: FetchLevel.success,
          },
          options: {
            ...state.options,
            queryAuctions: {
              ...state.options.queryAuctions,
              results: {
                ...state.options.queryAuctions.results,
                level: FetchLevel.success,
              },
              selected: action.payload.querySelected,
            },
          },
          relatedProfessionPricelists: action.payload.auctions.professionPricelists,
          totalResults: action.payload.auctions.total,
        };
      },
    },
  },
  queryauctions: {
    currentpage: {
      set: (
        state: IAuctionState,
        action: ReturnType<typeof SetCurrentPageQueryAuctions>,
      ): IAuctionState => {
        return { ...state, options: { ...state.options, currentPage: action.payload } };
      },
    },
    item: {
      select: (
        state: IAuctionState,
        action: ReturnType<typeof SelectItemQueryAuctions>,
      ): IAuctionState => {
        const nextSelected = ((): IItem[] => {
          const foundIndex = state.options.queryAuctions.selected.findIndex(
            v => v.blizzard_meta.id === action.payload.blizzard_meta.id,
          );

          if (foundIndex === -1) {
            return [action.payload];
          }

          if (foundIndex === 0) {
            return [...state.options.queryAuctions.selected.slice(1)];
          }

          return [
            ...state.options.queryAuctions.selected.slice(0, foundIndex),
            ...state.options.queryAuctions.selected.slice(foundIndex + 1),
          ];
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
      },
    },
    perpage: {
      set: (
        state: IAuctionState,
        action: ReturnType<typeof SetPerPageQueryAuctions>,
      ): IAuctionState => {
        return {
          ...state,
          options: {
            ...state.options,
            auctionsPerPage: action.payload,
            currentPage: defaultAuctionState.options.currentPage,
          },
        };
      },
    },
    sort: {
      set: (
        state: IAuctionState,
        action: ReturnType<typeof SetSortQueryAuctions>,
      ): IAuctionState => {
        return {
          ...state,
          options: {
            ...state.options,
            currentPage: defaultAuctionState.options.currentPage,
            ...action.payload,
          },
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
  const taskHandler = handlers[kind]?.[verb]?.[task] ?? null;
  if (taskHandler === null) {
    return state;
  }

  return taskHandler(state, action);
};
