import { connect } from "react-redux";

import { ChangeIsAddEntryDialogOpen, FetchUpdatePricelist } from "../../../actions/price-lists";
import {
  CreateEntryDialog,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/PriceLists/CreateEntryDialog";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { profile } = state.Main;
  const {
    isAddEntryDialogOpen,
    updatePricelist: { level: updatePricelistLevel },
    selectedList,
  } = state.PriceLists;

  return {
    isAddEntryDialogOpen,
    profile,
    selectedList,
    updatePricelistLevel,
  };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsAddEntryDialogOpen: ChangeIsAddEntryDialogOpen,
  updatePricelist: FetchUpdatePricelist,
};

export const CreateEntryDialogContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateEntryDialog);
