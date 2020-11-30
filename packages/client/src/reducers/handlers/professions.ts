import { IPriceListMap, IShortProfession, IShortRecipe } from "@sotah-inc/core";

import {
  DeselectSkillTierCategory,
  LoadProfessionsEntrypoint,
  ProfessionsActions,
  SelectSkillTierCategory,
} from "../../actions/professions";
import { defaultPriceListsState } from "../../types";
import { IFetchData, IItemsData, IPricelistHistoryState } from "../../types/global";
import { FetchLevel } from "../../types/main";
import {
  IProfessionsState,
  ISelectedSkillTier,
  ISelectedSkillTierCategory,
} from "../../types/professions";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IProfessionsState, ProfessionsActions> = {
  category: {
    skilltier: {
      deselect: (state, _action: ReturnType<typeof DeselectSkillTierCategory>) => {
        return {
          ...state,
          selectedRecipe: null,
          selectedSkillTierCategory: {
            index: -1,
            isSelected: false,
          },
        };
      },
      select: (state, action: ReturnType<typeof SelectSkillTierCategory>) => {
        return {
          ...state,
          selectedRecipe: null,
          selectedSkillTierCategory: {
            index: action.payload,
            isSelected: true,
          },
        };
      },
    },
  },
  entrypoint: {
    professions: {
      load: (
        state: IProfessionsState,
        action: ReturnType<typeof LoadProfessionsEntrypoint>,
      ): IProfessionsState => {
        const professions = ((): IFetchData<IShortProfession[]> => {
          if (action.payload.professions.response === null) {
            return {
              ...state.professions,
              level: FetchLevel.failure,
            };
          }

          return {
            ...state.professions,
            data: action.payload.professions.response.professions
              .sort((a, b) => {
                if (a.id === b.id) {
                  return 0;
                }

                return a.id > b.id ? 1 : -1;
              })
              .map(professionItem => {
                return {
                  ...professionItem,
                  skilltiers: professionItem.skilltiers.sort((a, b) => {
                    if (a.id === b.id) {
                      return 0;
                    }

                    if (a.is_primary && !b.is_primary) {
                      return 1;
                    }

                    if (b.is_primary && !a.is_primary) {
                      return -1;
                    }

                    return a.id > b.id ? 1 : -1;
                  }),
                };
              }),
            level: FetchLevel.success,
          };
        })();
        const selectedProfession = ((): IShortProfession | null | undefined => {
          if (typeof action.payload.selectedProfessionId === "undefined") {
            return undefined;
          }

          const foundProfession = professions.data.find(
            v => v.id === action.payload.selectedProfessionId,
          );
          if (typeof foundProfession === "undefined") {
            return null;
          }

          return foundProfession;
        })();
        const selectedSkillTier = ((): ISelectedSkillTier => {
          const foundSkillTier = action.payload.skillTier?.response?.skillTier ?? null;
          if (foundSkillTier === null) {
            return {
              data: null,
              isSelected: false,
            };
          }

          return {
            data: foundSkillTier,
            isSelected: true,
          };
        })();
        const selectedRecipe = ((): IItemsData<IShortRecipe> | null | undefined => {
          if (typeof action.payload.recipe === "undefined") {
            return undefined;
          }

          if (action.payload.recipe.response === null) {
            return null;
          }

          return {
            data: action.payload.recipe.response.recipe,
            items: action.payload.recipe.response.items,
          };
        })();
        const selectedSkillTierCategory = ((): ISelectedSkillTierCategory => {
          const skillTierCategories =
            action.payload.skillTier?.response?.skillTier.categories ?? null;

          if (skillTierCategories === null) {
            return {
              index: -1,
              isSelected: false,
            };
          }

          if (typeof selectedRecipe === "undefined" || selectedRecipe === null) {
            if (skillTierCategories.length === 0) {
              return {
                index: -1,
                isSelected: false,
              };
            }

            return {
              index: 0,
              isSelected: true,
            };
          }

          return skillTierCategories.reduce<ISelectedSkillTierCategory>(
            (selectedCategory, category, categoryIndex) => {
              if (selectedCategory.index > -1) {
                return selectedCategory;
              }

              if (
                category.recipes.some(
                  categoryRecipe => categoryRecipe.id === selectedRecipe.data.id,
                )
              ) {
                return { index: categoryIndex, isSelected: true };
              }

              return { index: -1, isSelected: false };
            },
            { index: -1, isSelected: false },
          );
        })();

        const pricelistHistory: IFetchData<IItemsData<IPricelistHistoryState>> = (() => {
          if (typeof action.payload.pricelistHistory === "undefined") {
            return defaultPriceListsState.pricelistHistory;
          }

          if (action.payload.pricelistHistory === null) {
            return { ...defaultPriceListsState.pricelistHistory, level: FetchLevel.failure };
          }

          return {
            data: {
              data: {
                history: action.payload.pricelistHistory.history,
                itemPriceLimits: action.payload.pricelistHistory.itemPriceLimits,
                overallPriceLimits: action.payload.pricelistHistory.overallPriceLimits,
              },
              items: action.payload.pricelistHistory.items,
            },
            errors: {},
            level: FetchLevel.success,
          };
        })();

        const priceTable: IFetchData<IItemsData<IPriceListMap>> = (() => {
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

        return {
          ...state,
          loadId: action.payload.loadId,
          priceTable,
          pricelistHistory,
          professions,
          selectedProfession,
          selectedProfessionId: action.payload.selectedProfessionId ?? 0,
          selectedRecipe,
          selectedRecipeId: action.payload.selectedRecipeId ?? 0,
          selectedSkillTier,
          selectedSkillTierCategory,
        };
      },
      request: (state): IProfessionsState => {
        return {
          ...state,
          professions: {
            ...state.professions,
            level: FetchLevel.fetching,
          },
        };
      },
    },
  },
  flag: {
    skilltier: {
      deselect: state => {
        return {
          ...state,
          selectedSkillTier: {
            ...state.selectedSkillTier,
            isSelected: false,
          },
        };
      },
      select: state => {
        return {
          ...state,
          selectedSkillTier: {
            ...state.selectedSkillTier,
            isSelected: true,
          },
        };
      },
    },
  },
};

export const run: Runner<IProfessionsState, ProfessionsActions> = (
  state: IProfessionsState,
  action: ProfessionsActions,
): IProfessionsState => {
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
