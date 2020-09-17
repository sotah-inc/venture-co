import { PriceListsActions } from "../actions";
import {
  CHANGE_IS_ADD_ENTRY_DIALOG_OPEN,
  CHANGE_IS_ADD_LIST_DIALOG_OPEN,
  CHANGE_IS_DELETE_LIST_DIALOG_OPEN,
  CHANGE_IS_EDIT_LIST_DIALOG_OPEN,
} from "../actions/price-lists";
import { defaultPriceListsState, IPriceListsState } from "../types/price-lists";
import { runners } from "./handlers";

type State = Readonly<IPriceListsState>;

export const priceLists = (state: State | undefined, action: PriceListsActions): State => {
  if (typeof state === "undefined") {
    return defaultPriceListsState;
  }

  switch (action.type) {
    case CHANGE_IS_ADD_LIST_DIALOG_OPEN:
      return {
        ...state,
        isAddListDialogOpen: action.payload,
      };
    case CHANGE_IS_EDIT_LIST_DIALOG_OPEN:
      return {
        ...state,
        isEditListDialogOpen: action.payload,
      };
    case CHANGE_IS_DELETE_LIST_DIALOG_OPEN:
      return {
        ...state,
        isDeleteListDialogOpen: action.payload,
      };
    case CHANGE_IS_ADD_ENTRY_DIALOG_OPEN:
      return {
        ...state,
        isAddListDialogOpen: action.payload,
      };
    default:
      return runners.pricelist(state, action);
  }
};
