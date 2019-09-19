import { INSERT_TOAST, OvenActions } from "../actions/oven";
import { defaultOvenState, IOvenState } from "../types/oven";

type State = Readonly<IOvenState>;

export const oven = (state: State | undefined, action: OvenActions): State => {
  if (state === undefined) {
    return defaultOvenState;
  }

  switch (action.type) {
    case INSERT_TOAST:
      return { ...state, ...action.payload };
  }

  return state;
};
