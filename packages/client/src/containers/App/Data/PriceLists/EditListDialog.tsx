import { connect } from "react-redux";

import { InsertToast } from "../../../../actions/oven";
import {
  AppendItems,
  ChangeIsEditListDialogOpen,
  FetchUpdatePricelist,
} from "../../../../actions/price-lists";
import {
  EditListDialog,
  IDispatchProps,
  IStateProps,
} from "../../../../components/App/Data/PriceLists/EditListDialog";
import { IStoreState } from "../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile, currentRegion, currentRealm } = state.Main;
  const {
    isEditListDialogOpen,
    items,
    updatePricelistLevel,
    updatePricelistErrors,
    selectedList,
    selectedExpansion,
    selectedProfession,
  } = state.PriceLists;

  return {
    currentRealm,
    currentRegion,
    isEditListDialogOpen,
    items,
    profile,
    selectedExpansion,
    selectedList,
    selectedProfession,
    updatePricelistErrors,
    updatePricelistLevel,
  };
};

const mapDispatchToProps: IDispatchProps = {
  appendItems: AppendItems,
  changeIsEditListDialogOpen: ChangeIsEditListDialogOpen,
  insertToast: InsertToast,
  updatePricelist: FetchUpdatePricelist,
};

export const EditListDialogContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(EditListDialog);
