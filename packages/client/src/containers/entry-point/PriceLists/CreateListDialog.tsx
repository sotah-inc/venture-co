import { connect } from "react-redux";

import { InsertToast } from "../../../actions/oven";
import {
  AppendItems,
  ChangeIsAddListDialogOpen,
  FetchCreatePricelist,
  FetchCreateProfessionPricelist,
} from "../../../actions/price-lists";
import {
  CreateListDialog,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/PriceLists/CreateListDialog";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile, currentRegion, currentRealm } = state.Main;
  const {
    isAddListDialogOpen,
    createPricelistLevel,
    createPricelistErrors,
    selectedProfession,
    selectedExpansion,
    selectedList,
  } = state.PriceLists;

  return {
    createPricelistErrors,
    createPricelistLevel,
    currentRealm,
    currentRegion,
    isAddListDialogOpen,
    profile,
    selectedExpansion,
    selectedList,
    selectedProfession,
  };
};

const mapDispatchToProps: IDispatchProps = {
  appendItems: AppendItems,
  changeIsAddListDialogOpen: ChangeIsAddListDialogOpen,
  createPricelist: FetchCreatePricelist,
  createProfessionPricelist: FetchCreateProfessionPricelist,
  insertToast: InsertToast,
};

export const CreateListDialogContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateListDialog);
