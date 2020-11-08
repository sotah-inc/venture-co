import { ProfessionsActions, ReceiveGetProfessions } from "../../actions/professions";
import { FetchLevel } from "../../types/main";
import { IProfessionsState } from "../../types/professions";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IProfessionsState, ProfessionsActions> = {
  professions: {
    get: {
      receive: (
        state: IProfessionsState,
        action: ReturnType<typeof ReceiveGetProfessions>,
      ): IProfessionsState => {
        if (action.payload === null || action.payload.response === null) {
          return {
            ...state,
            professions: {
              ...state.professions,
              level: FetchLevel.failure,
            },
          };
        }

        return {
          ...state,
          professions: {
            ...state.professions,
            data: action.payload.response.professions,
            level: FetchLevel.success,
          },
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
