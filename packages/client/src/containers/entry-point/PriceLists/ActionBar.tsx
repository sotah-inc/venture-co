import { connect } from "react-redux";

import {
  ChangeIsAddEntryDialogOpen,
  ChangeIsAddListDialogOpen,
  ChangeIsDeleteListDialogOpen,
  ChangeIsEditListDialogOpen,
} from "../../../actions/price-lists";
import {
  ActionBar,
  IDispatchProps,
  IOwnProps,
  IStateProps,
} from "../../../components/entry-point/PriceLists/ActionBar";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    currentRegion,
    currentRealm,
    userData,
    currentGameVersion,
    currentExpansion,
    selectedProfession: { value: selectedProfession },
  } = state.Main;
  const { isAddListDialogOpen, isAddEntryDialogOpen, selectedList } = state.PriceLists;

  return {
    currentGameVersion,
    currentRealm,
    currentRegion,
    isAddEntryDialogOpen,
    isAddListDialogOpen,
    userData,
    selectedExpansion: currentExpansion,
    selectedList,
    selectedProfession,
  };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsAddEntryDialogOpen: ChangeIsAddEntryDialogOpen,
  changeIsAddListDialogOpen: ChangeIsAddListDialogOpen,
  changeIsDeleteListDialogOpen: ChangeIsDeleteListDialogOpen,
  changeIsEditListDialogOpen: ChangeIsEditListDialogOpen,
};

export const ActionBarContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(ActionBar);
