import { ProfessionsActions } from "../actions/professions";
import { defaultProfessionsState, IProfessionsState } from "../types/professions";
import { runners } from "./handlers";

type State = Readonly<IProfessionsState>;

export function professions(state: State | undefined, action: ProfessionsActions): State {
  if (typeof state === "undefined") {
    return defaultProfessionsState;
  }

  switch (action.type) {
  default:
    return runners.profession(state, action);
  }
}
