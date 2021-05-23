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
  const { userData, currentRegion, currentRealm } = state.Main;
  const {
    isAddListDialogOpen,
    createPricelist,
    selectedProfession: { value: selectedProfession },
    selectedExpansion,
    selectedList,
  } = state.PriceLists;

  return {
    createPricelist,
    currentRealm,
    currentRegion,
    isAddListDialogOpen,
    userData,
    selectedExpansion,
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
