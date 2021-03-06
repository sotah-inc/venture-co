import { INSERT_TOAST, OvenActions } from "../actions/oven";
import { defaultOvenState, IOvenState } from "../types/oven";

type State = Readonly<IOvenState>;

export function oven(state: State | undefined, action: OvenActions): State {
  if (typeof state === "undefined") {
    return defaultOvenState;
  }

  switch (action.type) {
  case INSERT_TOAST:
    return { ...state, index: state.index + 1, toast: action.payload };
  }

  return state;
}
