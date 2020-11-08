import { ProfessionsActions } from "../../actions/professions";
import { IProfessionsState } from "../../types/professions";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IProfessionsState, ProfessionsActions> = {};

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
