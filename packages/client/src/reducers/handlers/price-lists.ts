import {
  IExpansion,
  IGetPricelistHistoriesResponse,
  IPricelistJson,
  IPriceListMap,
  IProfession,
  IProfessionPricelistJson,
  IQueryOwnerItemsMap,
} from "@sotah-inc/core";

import {
  ChangeSelectedExpansion,
  LoadPricelistsEntrypoint,
  PriceListsActions,
  ReceiveCreatePricelist,
  ReceiveCreateProfessionPricelist,
  ReceiveDeletePricelist,
  ReceiveDeleteProfessionPricelist,
  ReceiveGetItemsOwnership,
  ReceiveGetPricelist,
  ReceiveGetPricelistHistory,
  ReceiveGetPricelists,
  ReceiveGetProfessionPricelists,
  ReceiveGetUnmetDemand,
  ReceiveUpdatePricelist,
} from "../../actions/price-lists";
import { IFetchData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import {
  defaultPriceListsState,
  IExpansionProfessionPricelistMap,
  IPriceListsState,
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
        const selectedProfession: IProfession | null = (() => {
          if (typeof action.payload === "undefined") {
            return null;
          }

          return action.payload.professions.reduce<IProfession | null>(
            (previousValue, currentValue) => {
              if (previousValue !== null) {
                return previousValue;
              }

              if (currentValue.name === action.payload!.professionName) {
                return currentValue;
              }

              return null;
            },
            null,
          );
        })();

        const selectedExpansion: IExpansion | null = (() => {
          if (typeof action.payload === "undefined") {
            return null;
          }

          return action.payload.expansions.reduce<IExpansion | null>(
            (previousValue, currentValue) => {
              if (previousValue !== null) {
                return previousValue;
              }

              if (currentValue.name === action.payload!.expansionName) {
                return currentValue;
              }

              return null;
            },
            null,
          );
        })();

        const pricelistHistory: IFetchData<IGetPricelistHistoriesResponse> = (() => {
          if (
            typeof action.payload === "undefined" ||
            typeof action.payload.pricelistHistory === "undefined"
          ) {
            return defaultPriceListsState.pricelistHistory;
          }

          if (action.payload.pricelistHistory === null) {
            return { ...defaultPriceListsState.pricelistHistory, level: FetchLevel.failure };
          }

          return {
            data: action.payload.pricelistHistory,
            errors: {},
            level: FetchLevel.success,
          };
        })();

        const priceTable: IFetchData<IPriceListMap> = (() => {
          if (
            typeof action.payload === "undefined" ||
            typeof action.payload.currentPrices === "undefined"
          ) {
            return defaultPriceListsState.priceTable;
          }

          if (action.payload.currentPrices === null) {
            return { ...defaultPriceListsState.priceTable, level: FetchLevel.failure };
          }

          return {
            data: action.payload.currentPrices.price_list,
            errors: {},
            level: FetchLevel.success,
          };
        })();

        const itemsOwnership: IFetchData<IQueryOwnerItemsMap> = (() => {
          if (
            typeof action.payload === "undefined" ||
            typeof action.payload.currentSellers === "undefined"
          ) {
            return defaultPriceListsState.itemsOwnership;
          }

          if (action.payload.currentSellers === null) {
            return { ...defaultPriceListsState.itemsOwnership, level: FetchLevel.failure };
          }

          return {
            data: action.payload.currentSellers.ownership,
            errors: {},
            level: FetchLevel.success,
          };
        })();

        return {
          ...state,
          itemsOwnership,
          priceTable,
          pricelistHistory,
          selectedExpansion,
          selectedProfession,
        };
      },
    },
  },
  expansion: {
    selected: {
      change: (state: IPriceListsState, action: ReturnType<typeof ChangeSelectedExpansion>) => {
        return {
          ...state,
          selectedExpansion: action.payload,
          selectedList: null,
        };
      },
    },
  },
  itemsownership: {
    get: {
      receive: (state: IPriceListsState, action: ReturnType<typeof ReceiveGetItemsOwnership>) => {
        if (action.payload === null) {
          return { ...state, getItemsOwnershipLevel: FetchLevel.failure };
        }

        return {
          ...state,
          getItemsOwnershipLevel: FetchLevel.success,
          itemsOwnershipMap: action.payload.ownership,
        };
      },
      request: (state: IPriceListsState) => {
        return { ...state, getItemsOwnershipLevel: FetchLevel.fetching };
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
            data: [...state.pricelists.data, selectedList],
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

        const deletedIndex = getPricelistIndex(state.pricelists.data, action.payload);
        const pricelists: IPricelistJson[] = (() => {
          if (deletedIndex === 0) {
            return [...state.pricelists.data.slice(1)];
          }

          return [
            ...state.pricelists.data.slice(0, deletedIndex),
            ...state.pricelists.data.slice(deletedIndex + 1),
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
            data: pricelists,
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
            data: action.payload.price_list,
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

        let replacedIndex = getPricelistIndex(state.pricelists.data, selectedList.id);
        if (replacedIndex !== -1) {
          const pricelists: IPricelistJson[] = (() => {
            if (replacedIndex === 0) {
              return [selectedList, ...state.pricelists.data.slice(1)];
            }

            return [
              ...state.pricelists.data.slice(0, replacedIndex),
              selectedList,
              ...state.pricelists.data.slice(replacedIndex + 1),
            ];
          })();

          return {
            ...state,
            ...action.payload.meta,
            pricelists: { ...state.pricelists, data: pricelists },
            selectedList,
            updatePricelist: { errors: {}, level: FetchLevel.success },
          };
        }

        const professionPricelists: IExpansionProfessionPricelistMap = (() => {
          const expansionName = state.selectedExpansion!.name;
          const prevResult = state.professionPricelists.data[expansionName];
          replacedIndex = getProfessionPricelistIndex(prevResult, selectedList.id);

          const professionPricelist: IProfessionPricelistJson = {
            ...prevResult[replacedIndex],
            pricelist: selectedList,
          };

          return {
            ...state.professionPricelists.data,
            [expansionName]: [
              ...prevResult.slice(0, replacedIndex),
              professionPricelist,
              ...prevResult.slice(replacedIndex + 1),
            ],
          };
        })();

        return {
          ...state,
          ...action.payload.meta,
          professionPricelists: { ...state.professionPricelists, data: professionPricelists },
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
  pricelisthistory: {
    get: {
      receive: (state: IPriceListsState, action: ReturnType<typeof ReceiveGetPricelistHistory>) => {
        if (action.payload === null) {
          return {
            ...state,
            pricelistHistory: { ...state.pricelistHistory, level: FetchLevel.failure },
          };
        }

        return {
          ...state,
          pricelistHistory: {
            data: action.payload,
            errors: {},
            level: FetchLevel.success,
          },
        };
      },
      request: (state: IPriceListsState) => {
        return {
          ...state,
          pricelistHistory: { ...state.pricelistHistory, level: FetchLevel.fetching },
        };
      },
    },
  },
  pricelists: {
    get: {
      receive: (state: IPriceListsState, action: ReturnType<typeof ReceiveGetPricelists>) => {
        return {
          ...state,
          pricelists: {
            data: action.payload.pricelists,
            errors: {},
            level: FetchLevel.success,
          },
        };
      },
      request: (state: IPriceListsState) => {
        return { ...state, getPricelistsLevel: FetchLevel.fetching };
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
        const professionPricelists: IExpansionProfessionPricelistMap = (() => {
          const expansionName = state.selectedExpansion!.name;
          const result: IProfessionPricelistJson[] = (() => {
            if (!(expansionName in state.professionPricelists.data)) {
              return [professionPricelist];
            }

            return [...state.professionPricelists.data[expansionName], professionPricelist];
          })();

          return {
            ...state.professionPricelists.data,
            [expansionName]: result,
          };
        })();

        return {
          ...state,
          createPricelist: {
            errors: {},
            level: FetchLevel.success,
          },
          isAddListDialogOpen: false,
          professionPricelists: { ...state.professionPricelists, data: professionPricelists },
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

        const expansionName = state.selectedExpansion!.name;
        const prevResult = state.professionPricelists.data[expansionName];
        const deletedIndex = getProfessionPricelistIndex(prevResult, action.payload.id);
        const nextResult: IProfessionPricelistJson[] = (() => {
          if (deletedIndex === 0) {
            return [...prevResult.slice(1)];
          }

          return [...prevResult.slice(0, deletedIndex), ...prevResult.slice(deletedIndex + 1)];
        })();
        const professionPricelists: IExpansionProfessionPricelistMap = {
          ...state.professionPricelists.data,
          [expansionName]: nextResult,
        };
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
          professionPricelists: { ...state.professionPricelists, data: professionPricelists },
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

        const professionPricelists = action.payload.data!.profession_pricelists.reduce<
          IExpansionProfessionPricelistMap
        >((result: IExpansionProfessionPricelistMap, v: IProfessionPricelistJson) => {
          if (!(v.expansion in result)) {
            result[v.expansion] = [];
          }
          result[v.expansion].push(v);

          return result;
        }, {});

        return {
          ...state,
          professionPricelists: {
            data: professionPricelists,
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
  unmetdemand: {
    get: {
      receive: (state: IPriceListsState, action: ReturnType<typeof ReceiveGetUnmetDemand>) => {
        if (action.payload === null || action.payload.data === null) {
          return {
            ...state,
            unmetDemand: {
              ...state.unmetDemand,
              level: FetchLevel.failure,
            },
          };
        }

        return {
          ...state,
          unmetDemand: {
            data: action.payload.data,
            errors: {},
            level: FetchLevel.success,
          },
        };
      },
      request: (state: IPriceListsState) => {
        return {
          ...state,
          unmetDemand: {
            ...state.unmetDemand,
            level: FetchLevel.fetching,
          },
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
