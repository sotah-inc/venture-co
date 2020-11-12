import { IShortProfession, IShortRecipe, IShortSkillTier } from "@sotah-inc/core";

import { LoadProfessionsEntrypoint, ProfessionsActions } from "../../actions/professions";
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

        return {
          ...state,
          loadId: action.payload.loadId,
          professions,
          selectedProfession,
          selectedRecipe,
          selectedSkillTier,
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
