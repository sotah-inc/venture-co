import { PriceListsActions } from "../actions";
import { defaultPriceListsState, IPriceListsState } from "../types/price-lists";
import { runners } from "./handlers";

type State = Readonly<IPriceListsState>;

export const priceLists = (state: State | undefined, action: PriceListsActions): State => {
  if (state === undefined) {
    return defaultPriceListsState;
  }

  switch (action.type) {
    default:
      return runners.pricelist(state, action);
  }
};
