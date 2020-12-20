import {
  IExpansion,
  IItemPrices,
  IPricelistJson,
  IProfession,
  IProfessionPricelistJson,
} from "@sotah-inc/core";

import {
  LoadPricelistsEntrypoint,
  PriceListsActions,
  ReceiveCreatePricelist,
  ReceiveCreateProfessionPricelist,
  ReceiveDeletePricelist,
  ReceiveDeleteProfessionPricelist,
  ReceiveGetItemPriceHistories,
  ReceiveGetPricelist,
  ReceiveGetPricelists,
  ReceiveGetProfessionPricelists,
  ReceiveUpdatePricelist,
} from "../../actions/price-lists";
import { IFetchData, IItemPriceHistoriesState, IItemsData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import {
  defaultPriceListsState,
  IPriceListsState,
  IUnmetDemandState,
} from "../../types/price-lists";
import { getPricelistIndex, getProfessionPricelistIndex } from "../helper";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IPriceListsState, PriceListsActions> = {
  entrypoint: {
    pricelists: {
      load: (
        state: IPriceListsState,
        action: ReturnType<typeof LoadPricelistsEntrypoint>,
      ): IPriceListsState => {
        const selectedProfession: IProfession | null =
          action.payload.professions.find(
            v => v.name === action.payload.professionNameData?.value,
          ) ?? null;
        const selectedExpansion: IExpansion | null =
          action.payload.expansions.find(v => v.name === action.payload.expansionName) ?? null;
        const selectedList: IPricelistJson | null = action.payload.selectedList ?? null;

        const itemPriceHistories: IFetchData<IItemsData<IItemPriceHistoriesState>> = (() => {
          if (typeof action.payload.itemPriceHistories === "undefined") {
            return defaultPriceListsState.itemPriceHistories;
          }

          if (action.payload.itemPriceHistories === null) {
            return { ...defaultPriceListsState.itemPriceHistories, level: FetchLevel.failure };
          }

          return {
            data: {
              data: {
                history: action.payload.itemPriceHistories.history,
                itemPriceLimits: action.payload.itemPriceHistories.itemPriceLimits,
                overallPriceLimits: action.payload.itemPriceHistories.overallPriceLimits,
              },
              items: action.payload.itemPriceHistories.items,
            },
            errors: {},
            level: FetchLevel.success,
          };
        })();

        const priceTable: IFetchData<IItemsData<IItemPrices>> = (() => {
          if (typeof action.payload.currentPrices === "undefined") {
            return defaultPriceListsState.priceTable;
          }

          if (action.payload.currentPrices === null) {
            return { ...defaultPriceListsState.priceTable, level: FetchLevel.failure };
          }

          return {
            data: {
              data: action.payload.currentPrices.price_list,
              items: action.payload.currentPrices.items,
            },
            errors: {},
            level: FetchLevel.success,
          };
        })();

        const professionPricelists: IFetchData<IItemsData<IProfessionPricelistJson[]>> = (() => {
          if (typeof action.payload.professionPricelists === "undefined") {
            return defaultPriceListsState.professionPricelists;
          }

          if (action.payload.professionPricelists.data === null) {
            return { ...defaultPriceListsState.professionPricelists, level: FetchLevel.failure };
          }

          // tslint:disable-next-line:max-line-length
          const sortedProfessionPricelists = action.payload.professionPricelists.data.profession_pricelists.sort(
            (a, b) => {
              if (a.pricelist.name === b.pricelist.name) {
                return 0;
              }

              return a.pricelist.name > b.pricelist.name ? 1 : -1;
            },
          );

          return {
            data: {
              data: sortedProfessionPricelists,
              items: action.payload.professionPricelists.data.items,
            },
            errors: {},
            level: FetchLevel.success,
          };
        })();

        const unmetDemand: IFetchData<IItemsData<IUnmetDemandState>> = (() => {
          if (typeof action.payload.unmetDemand === "undefined") {
            return defaultPriceListsState.unmetDemand;
          }

          if (action.payload.unmetDemand.data === null) {
            return { ...defaultPriceListsState.unmetDemand, level: FetchLevel.failure };
          }

          return {
            data: {
              data: {
                professionPricelists: action.payload.unmetDemand.data.professionPricelists,
                unmetItemIds: action.payload.unmetDemand.data.unmetItemIds,
              },
              items: action.payload.unmetDemand.data.items,
            },
            errors: {},
            level: FetchLevel.success,
          };
        })();

        const loadId = action.payload.loadId;

        return {
          ...state,
          itemPriceHistories,
          loadId,
          priceTable,
          professionPricelists,
          selectedExpansion,
          selectedList,
          selectedProfession: {
            isPredefined: !!action.payload.professionNameData?.isPredefined,
            value: selectedProfession,
          },
          unmetDemand,
        };
      },
    },
  },
  itempricehistories: {
    get: {
      receive: (
        state: IPriceListsState,
        action: ReturnType<typeof ReceiveGetItemPriceHistories>,
      ) => {
        if (action.payload === null) {
          return {
            ...state,
            itemPriceHistories: { ...state.itemPriceHistories, level: FetchLevel.failure },
          };
        }

        return {
          ...state,
          itemPriceHistories: {
            data: {
              data: {
                history: action.payload.history,
                itemPriceLimits: action.payload.itemPriceLimits,
                overallPriceLimits: action.payload.overallPriceLimits,
              },
              items: action.payload.items,
            },
            errors: {},
            level: FetchLevel.success,
          },
        };
      },
      request: (state: IPriceListsState) => {
        return {
          ...state,
          itemPriceHistories: { ...state.itemPriceHistories, level: FetchLevel.fetching },
        };
      },
    },
  },
  pricelist: {
    create: {
      receive: (state: IPriceListsState, action: ReturnType<typeof ReceiveCreatePricelist>) => {
        if (action.payload.errors !== null) {
          return {
            ...state,
            createPricelist: {
              errors: action.payload.errors,
              level: FetchLevel.failure,
            },
          };
        }

        const selectedList: IPricelistJson = {
          ...action.payload.data!.pricelist,
          pricelist_entries: action.payload.data!.entries,
        };

        return {
          ...state,
          createPricelist: {
            errors: {},
            level: FetchLevel.success,
          },
          isAddListDialogOpen: false,
          pricelists: {
            ...state.pricelists,
            data: {
              ...state.pricelists.data,
              data: [...state.pricelists.data.data, selectedList],
            },
          },
          selectedList,
        };
      },
      request: (state: IPriceListsState) => {
        return {
          ...state,
          createPricelist: {
            ...state.createPricelist,
            level: FetchLevel.fetching,
          },
        };
      },
    },
    delete: {
      receive: (state: IPriceListsState, action: ReturnType<typeof ReceiveDeletePricelist>) => {
        if (action.payload === null) {
          return {
            ...state,
            deletePricelist: { errors: {}, level: FetchLevel.failure },
          };
        }

        const deletedIndex = getPricelistIndex(state.pricelists.data.data, action.payload);
        const pricelists: IPricelistJson[] = (() => {
          if (deletedIndex === 0) {
            return [...state.pricelists.data.data.slice(1)];
          }

          return [
            ...state.pricelists.data.data.slice(0, deletedIndex),
            ...state.pricelists.data.data.slice(deletedIndex + 1),
          ];
        })();
        const selectedList: IPricelistJson | null = (() => {
          if (pricelists.length === 0) {
            return null;
          }

          const isLastDeleted = deletedIndex === pricelists.length;
          return isLastDeleted ? pricelists[deletedIndex - 1] : pricelists[deletedIndex];
        })();

        return {
          ...state,
          deletePricelist: { errors: {}, level: FetchLevel.success },
          isDeleteListDialogOpen: false,
          pricelists: {
            ...state.pricelists,
            data: {
              ...state.pricelists.data,
              data: pricelists,
            },
          },
          selectedList,
        };
      },
      request: (state: IPriceListsState): IPriceListsState => {
        return {
          ...state,
          deletePricelist: { ...state.deletePricelist, level: FetchLevel.fetching },
        };
      },
    },
    get: {
      receive: (
        state: IPriceListsState,
        action: ReturnType<typeof ReceiveGetPricelist>,
      ): IPriceListsState => {
        if (action.payload === null) {
          return { ...state, priceTable: { ...state.priceTable, level: FetchLevel.failure } };
        }

        return {
          ...state,
          priceTable: {
            data: {
              data: action.payload.price_list,
              items: action.payload.items,
            },
            errors: {},
            level: FetchLevel.success,
          },
        };
      },
      request: (state: IPriceListsState): IPriceListsState => {
        return { ...state, priceTable: { ...state.priceTable, level: FetchLevel.fetching } };
      },
    },
    update: {
      receive: (state: IPriceListsState, action: ReturnType<typeof ReceiveUpdatePricelist>) => {
        if (action.payload.result.errors !== null) {
          return {
            ...state,
            updatePricelist: { errors: action.payload.result.errors, level: FetchLevel.failure },
          };
        }

        const selectedList: IPricelistJson = {
          ...action.payload.result.data!.pricelist,
          pricelist_entries: action.payload.result.data!.entries,
        };

        let replacedIndex = getPricelistIndex(state.pricelists.data.data, selectedList.id);
        if (replacedIndex !== -1) {
          const pricelists: IPricelistJson[] = (() => {
            if (replacedIndex === 0) {
              return [selectedList, ...state.pricelists.data.data.slice(1)];
            }

            return [
              ...state.pricelists.data.data.slice(0, replacedIndex),
              selectedList,
              ...state.pricelists.data.data.slice(replacedIndex + 1),
            ];
          })();

          return {
            ...state,
            ...action.payload.meta,
            pricelists: {
              ...state.pricelists,
              data: { ...state.pricelists.data, data: pricelists },
            },
            selectedList,
            updatePricelist: { errors: {}, level: FetchLevel.success },
          };
        }

        const professionPricelists: IProfessionPricelistJson[] = (() => {
          replacedIndex = getProfessionPricelistIndex(
            state.professionPricelists.data.data,
            selectedList.id,
          );

          const professionPricelist: IProfessionPricelistJson = {
            ...state.professionPricelists.data.data[replacedIndex],
            pricelist: selectedList,
          };

          return [
            ...state.professionPricelists.data.data.slice(0, replacedIndex),
            professionPricelist,
            ...state.professionPricelists.data.data.slice(replacedIndex + 1),
          ];
        })();

        return {
          ...state,
          ...action.payload.meta,
          itemPriceHistories: {
            ...state.itemPriceHistories,
            level: FetchLevel.prompted,
          },
          priceTable: {
            ...state.priceTable,
            level: FetchLevel.prompted,
          },
          professionPricelists: {
            ...state.professionPricelists,
            data: { ...state.professionPricelists.data, professionPricelists },
          },
          selectedList,
          updatePricelist: { errors: {}, level: FetchLevel.success },
        };
      },
      request: (state: IPriceListsState) => {
        return {
          ...state,
          updatePricelist: { ...state.updatePricelist, level: FetchLevel.fetching },
        };
      },
    },
  },
  pricelists: {
    get: {
      receive: (state: IPriceListsState, action: ReturnType<typeof ReceiveGetPricelists>) => {
        if (action.payload === null) {
          return {
            ...state,
            pricelists: {
              data: defaultPriceListsState.pricelists.data,
              errors: {},
              level: FetchLevel.failure,
            },
          };
        }

        return {
          ...state,
          pricelists: {
            data: {
              ...state.pricelists.data,
              data: action.payload.pricelists,
              items: action.payload.items,
            },
            errors: {},
            level: FetchLevel.success,
          },
        };
      },
      request: (state: IPriceListsState) => {
        return { ...state, pricelists: { ...state.pricelists, level: FetchLevel.fetching } };
      },
    },
  },
  professionpricelist: {
    create: {
      receive: (
        state: IPriceListsState,
        action: ReturnType<typeof ReceiveCreateProfessionPricelist>,
      ) => {
        if (action.payload.errors !== null) {
          return {
            ...state,
            createPricelist: {
              errors: action.payload.errors,
              level: FetchLevel.failure,
            },
          };
        }

        const selectedList: IPricelistJson = {
          ...action.payload.data!.pricelist,
          pricelist_entries: action.payload.data!.entries,
        };
        const professionPricelist: IProfessionPricelistJson = {
          ...action.payload.data!.profession_pricelist,
          pricelist: selectedList,
        };
        const professionPricelists: IProfessionPricelistJson[] = (() => {
          return [...state.professionPricelists.data.data, professionPricelist];
        })();

        return {
          ...state,
          createPricelist: {
            errors: {},
            level: FetchLevel.success,
          },
          isAddListDialogOpen: false,
          professionPricelists: {
            ...state.professionPricelists,
            data: { ...state.professionPricelists.data, professionPricelists },
          },
          selectedList,
        };
      },
      request: (state: IPriceListsState) => {
        return {
          ...state,
          createPricelist: {
            ...state.createPricelist,
            level: FetchLevel.fetching,
          },
        };
      },
    },
    delete: {
      receive: (
        state: IPriceListsState,
        action: ReturnType<typeof ReceiveDeleteProfessionPricelist>,
      ) => {
        if (action.payload.errors !== null) {
          return {
            ...state,
            deletePricelist: { errors: action.payload.errors, level: FetchLevel.failure },
          };
        }
        const deletedIndex = getProfessionPricelistIndex(
          state.professionPricelists.data.data,
          action.payload.id,
        );
        const nextResult: IProfessionPricelistJson[] = (() => {
          if (deletedIndex === 0) {
            return [...state.professionPricelists.data.data.slice(1)];
          }

          return [
            ...state.professionPricelists.data.data.slice(0, deletedIndex),
            ...state.professionPricelists.data.data.slice(deletedIndex + 1),
          ];
        })();
        const selectedList: IPricelistJson | null = (() => {
          if (nextResult.length === 0) {
            return null;
          }

          const isLastDeleted = deletedIndex === nextResult.length;
          return isLastDeleted
            ? nextResult[deletedIndex - 1].pricelist!
            : nextResult[deletedIndex].pricelist!;
        })();

        return {
          ...state,
          deletePricelist: { errors: {}, level: FetchLevel.success },
          isDeleteListDialogOpen: false,
          professionPricelists: {
            ...state.professionPricelists,
            data: { ...state.professionPricelists.data, data: nextResult },
          },
          selectedList,
        };
      },
      request: (state: IPriceListsState) => {
        return {
          ...state,
          deletePricelist: { ...state.deletePricelist, level: FetchLevel.fetching },
        };
      },
    },
    update: {},
  },
  professionpricelists: {
    get: {
      receive: (
        state: IPriceListsState,
        action: ReturnType<typeof ReceiveGetProfessionPricelists>,
      ) => {
        if (action.payload.errors !== null) {
          return {
            ...state,
            professionPricelists: { ...state.professionPricelists, level: FetchLevel.failure },
          };
        }

        return {
          ...state,
          professionPricelists: {
            data: {
              ...state.professionPricelists.data,
              data: action.payload.data!.profession_pricelists,
              items: action.payload.data!.items!,
            },
            errors: {},
            level: FetchLevel.success,
          },
        };
      },
      request: (state: IPriceListsState) => {
        return {
          ...state,
          professionPricelists: { ...state.professionPricelists, level: FetchLevel.fetching },
        };
      },
    },
  },
};

export const run: Runner<IPriceListsState, PriceListsActions> = (
  state: IPriceListsState,
  action: PriceListsActions,
): IPriceListsState => {
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
