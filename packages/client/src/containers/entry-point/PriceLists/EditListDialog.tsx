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
  const {
    userData,
    currentGameVersion,
    currentRegion,
    currentRealm,
    currentExpansion,
    selectedProfession,
  } = state.Main;
  const {
    isEditListDialogOpen,
    updatePricelist: { level: updatePricelistLevel, errors: updatePricelistErrors },
    selectedList,
  } = state.PriceLists;

  return {
    currentGameVersion,
    currentRealm,
    currentRegion,
    isEditListDialogOpen,
    userData,
    selectedExpansion: currentExpansion,
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
