import { IShortProfession } from "@sotah-inc/core";

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
            data: action.payload.professions.response.professions.sort((a, b) =>
              a.name.localeCompare(b.name),
            ),
            level: FetchLevel.success,
          };
        })();
        const selectedProfession: IShortProfession | null =
          professions.data.find(
            v =>
              action.payload.selectedProfessionId && v.id === action.payload.selectedProfessionId,
          ) ?? null;

        return {
          ...state,
          loadId: action.payload.loadId,
          professions,
          selectedProfession,
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
