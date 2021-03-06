import { connect } from "react-redux";

import { InsertToast } from "../../../actions/oven";
import {
  ChangeIsDeleteListDialogOpen,
  FetchDeletePricelist,
  FetchDeleteProfessionPricelist,
} from "../../../actions/price-lists";
import {
  DeleteListDialog,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/PriceLists/DeleteListDialog";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { profile, currentRegion, currentRealm } = state.Main;
  const {
    selectedList,
    isDeleteListDialogOpen,
    deletePricelist: { errors: deletePricelistErrors, level: deletePricelistLevel },
    selectedProfession: { value: selectedProfession },
    selectedExpansion,
  } = state.PriceLists;

  return {
    currentRealm,
    currentRegion,
    deletePricelistErrors,
    deletePricelistLevel,
    isDeleteListDialogOpen,
    profile,
    selectedExpansion,
    selectedList,
    selectedProfession,
  };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsDeleteListDialogOpen: ChangeIsDeleteListDialogOpen,
  deletePricelist: FetchDeletePricelist,
  deleteProfessionPricelist: FetchDeleteProfessionPricelist,
  insertToast: InsertToast,
};

export const DeleteListDialogContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(DeleteListDialog);
