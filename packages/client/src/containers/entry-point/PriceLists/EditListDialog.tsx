import { connect } from "react-redux";

import { InsertToast } from "../../../actions/oven";
import { ChangeIsEditListDialogOpen, FetchUpdatePricelist } from "../../../actions/price-lists";
import {
  EditListDialog,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/PriceLists/EditListDialog";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { userData, currentRegion, currentRealm } = state.Main;
  const {
    isEditListDialogOpen,
    updatePricelist: { level: updatePricelistLevel, errors: updatePricelistErrors },
    selectedList,
    selectedExpansion,
    selectedProfession: { value: selectedProfession },
  } = state.PriceLists;

  return {
    currentRealm,
    currentRegion,
    isEditListDialogOpen,
    userData,
    selectedExpansion,
    selectedList,
    selectedProfession,
    updatePricelistErrors,
    updatePricelistLevel,
  };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsEditListDialogOpen: ChangeIsEditListDialogOpen,
  insertToast: InsertToast,
  updatePricelist: FetchUpdatePricelist,
};

export const EditListDialogContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(EditListDialog);
