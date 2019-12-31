import {
  NAVIGATE_PROFESSIONNODE,
  PriceListsActions,
  RESET_PROFESSIONS_SELECTIONS,
} from "../actions/price-lists";
import { defaultPriceListsState, IPriceListsState } from "../types/price-lists";
import { runners } from "./handlers";

type State = Readonly<IPriceListsState>;

export const priceLists = (state: State | undefined, action: PriceListsActions): State => {
  if (state === undefined) {
    return defaultPriceListsState;
  }

  switch (action.type) {
    case NAVIGATE_PROFESSIONNODE:
      return {
        ...state,
        selectedExpansion: action.payload.expansion,
        selectedList: action.payload.pricelist,
        selectedProfession: action.payload.profession,
      };
    case RESET_PROFESSIONS_SELECTIONS:
      return { ...state, selectedProfession: null, selectedExpansion: null, selectedList: null };
    default:
      return runners.pricelist(state, action);
  }
};
