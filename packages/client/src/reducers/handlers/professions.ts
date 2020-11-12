import { IShortProfession, IShortRecipe, IShortSkillTier } from "@sotah-inc/core";

import {
  LoadProfessionsEntrypoint,
  ProfessionsActions,
  SetSkillSetCategoryIndex,
} from "../../actions/professions";
import { IFetchData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { IProfessionsState } from "../../types/professions";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IProfessionsState, ProfessionsActions> = {
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
            data: action.payload.professions.response.professions.sort((a, b) => {
              if (a.id === b.id) {
                return 0;
              }

              return a.id > b.id ? 1 : -1;
            }),
            level: FetchLevel.success,
          };
        })();
        const selectedProfession: IShortProfession | null =
          professions.data.find(
            v =>
              action.payload.selectedProfessionId && v.id === action.payload.selectedProfessionId,
          ) ?? null;
        const selectedSkillTier: IShortSkillTier | null =
          action.payload.skillTier?.response?.skillTier ?? null;
        const selectedRecipe: IShortRecipe | null = action.payload.recipe?.response?.recipe ?? null;
        const selectedSkillTierCategoryIndex = ((): number => {
          const skillTierCategories =
            action.payload.skillTier?.response?.skillTier.categories ?? null;

          if (selectedRecipe === null || skillTierCategories === null) {
            return -1;
          }

          return skillTierCategories.reduce<number>((foundIndex, category, categoryIndex) => {
            if (foundIndex > -1) {
              return foundIndex;
            }

            if (category.recipes.some(categoryRecipe => categoryRecipe.id === selectedRecipe.id)) {
              return categoryIndex;
            }

            return -1;
          }, -1);
        })();

        return {
          ...state,
          loadId: action.payload.loadId,
          professions,
          selectedProfession,
          selectedRecipe,
          selectedSkillTier,
          selectedSkillTierCategoryIndex,
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
  index: {
    skilltiercategory: {
      set: (state, action: ReturnType<typeof SetSkillSetCategoryIndex>) => {
        const selectedRecipe = action.payload === -1 ? null : state.selectedRecipe;

        return {
          ...state,
          selectedRecipe,
          selectedSkillTierCategoryIndex: action.payload,
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