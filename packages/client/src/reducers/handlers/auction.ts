import { IAuction, IQueryGeneralItemItem } from "@sotah-inc/core";

import { AuctionActions } from "../../actions";
import {
  LoadAuctionListEntrypoint,
  SelectItemQueryAuctions,
  SelectPetQueryAuctions,
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

        return {
          ...state,
          auctionsResult: {
            ...state.auctionsResult,
            data: {
              auctions,
              items: action.payload.auctions.items,
              pets: action.payload.auctions.pets,
            },
            level: FetchLevel.success,
          },
          options: {
            ...state.options,
            initialQueryResults: action.payload.initialQueryResults,
            selected: action.payload.querySelected,
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
        const nextSelected = ((): IQueryGeneralItemItem[] => {
          const foundIndex = state.options.selected.findIndex(v => {
            return v.item?.id === action.payload?.id;
          });

          if (foundIndex === -1) {
            return [...state.options.selected, { pet: null, item: action.payload }];
          }

          if (foundIndex === 0) {
            return [...state.options.selected.slice(1)];
          }

          return [
            ...state.options.selected.slice(0, foundIndex),
            ...state.options.selected.slice(foundIndex + 1),
          ];
        })();

        return {
          ...state,
          options: {
            ...state.options,
            currentPage: 0,
            selected: nextSelected,
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
    pet: {
      select: (
        state: IAuctionState,
        action: ReturnType<typeof SelectPetQueryAuctions>,
      ): IAuctionState => {
        const nextSelected = ((): IQueryGeneralItemItem[] => {
          const foundIndex = state.options.selected.findIndex(v => {
            return v.pet?.id === action.payload?.id;
          });

          if (foundIndex === -1) {
            return [...state.options.selected, { item: null, pet: action.payload }];
          }

          if (foundIndex === 0) {
            return [...state.options.selected.slice(1)];
          }

          return [
            ...state.options.selected.slice(0, foundIndex),
            ...state.options.selected.slice(foundIndex + 1),
          ];
        })();

        return {
          ...state,
          options: {
            ...state.options,
            currentPage: 0,
            selected: nextSelected,
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
