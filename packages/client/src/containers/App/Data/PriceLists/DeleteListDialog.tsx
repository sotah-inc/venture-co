import { connect } from "react-redux";

import { InsertToast } from "../../../../actions/oven";
import {
  ChangeIsDeleteListDialogOpen,
  FetchDeletePricelist,
  FetchDeleteProfessionPricelist,
} from "../../../../actions/price-lists";
import {
  DeleteListDialog,
  IDispatchProps,
  IStateProps,
} from "../../../../components/App/Data/PriceLists/DeleteListDialog";
import { IStoreState } from "../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile, currentRegion, currentRealm } = state.Main;
  const {
    selectedList,
    isDeleteListDialogOpen,
    deletePricelistLevel,
    selectedProfession,
    selectedExpansion,
  } = state.PriceLists;

  return {
    currentRealm,
    currentRegion,
    deletePricelistLevel,
    isDeleteListDialogOpen,
    profile,
    selectedExpansion,
    selectedList,
    selectedProfession,
  };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsDeleteListDialogOpen: ChangeIsDeleteListDialogOpen,
  deletePricelist: FetchDeletePricelist,
  deleteProfessionPricelist: FetchDeleteProfessionPricelist,
  insertToast: InsertToast,
};

export const DeleteListDialogContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(DeleteListDialog);
