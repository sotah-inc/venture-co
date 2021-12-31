import { connect } from "react-redux";

import { InsertToast } from "../../../actions/oven";
import {
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

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    userData,
    currentRegion,
    currentRealm,
    currentGameVersion,
    currentExpansion,
    selectedProfession,
  } = state.Main;
  const { isAddListDialogOpen, createPricelist, selectedList } = state.PriceLists;

  return {
    currentGameVersion,
    createPricelist,
    currentRealm,
    currentRegion,
    isAddListDialogOpen,
    userData,
    selectedExpansion: currentExpansion,
    selectedList,
    selectedProfession,
  };
}

const mapDispatchToProps: IDispatchProps = {
  ChangeIsAddListDialogOpen,
  FetchCreatePricelist,
  FetchCreateProfessionPricelist,
  InsertToast,
};

export const CreateListDialogContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateListDialog);
