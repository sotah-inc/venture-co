import { INSERT_TOAST, OvenActions } from "../actions/oven";
import { defaultOvenState, IOvenState } from "../types/oven";

type State = Readonly<IOvenState>;

export const oven = (state: State | undefined, action: OvenActions): State => {
  if (state === undefined) {
    return defaultOvenState;
  }

  // tslint:disable-next-line:no-console
  console.log("oven()");

  switch (action.type) {
    case INSERT_TOAST:
      return { ...state, ...action.payload, index: state.index + 1 };
  }

  return state;
};
