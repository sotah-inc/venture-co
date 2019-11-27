import { connect } from "react-redux";

import { ChangeIsAddEntryDialogOpen } from "../../../../actions/price-lists";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  PricelistPanel,
} from "../../../../components/entry-point/PriceLists/PricelistTree/PricelistPanel";
import { IStoreState } from "../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion, currentRealm } = state.Main;
  const { isAddEntryDialogOpen } = state.PriceLists;
  return { currentRegion, currentRealm, isAddEntryDialogOpen };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsAddEntryDialogOpen: ChangeIsAddEntryDialogOpen,
};

export const PricelistPanelContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(PricelistPanel);
