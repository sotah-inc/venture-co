import { AuctionActions } from "../../actions";
import { IAuctionState } from "../../types/auction";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IAuctionState, AuctionActions> = {};

export const run: Runner<IAuctionState, AuctionActions> = (
  state: IAuctionState,
  action: AuctionActions,
): IAuctionState => {
  const [kind, verb, task] = action.type
    .split("_")
    .reverse()
    .map(v => v.toLowerCase());
  if (!(kind in handlers)) {
    return state;
  }
  const kindHandlers = handlers[kind];

  if (!(verb in kindHandlers)) {
    return state;
  }
  const verbHandlers = kindHandlers[verb];

  if (!(task in verbHandlers)) {
    return state;
  }
  const taskHandler = verbHandlers[task];

  return taskHandler(state, action);
};
