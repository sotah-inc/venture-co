import { connect } from "react-redux";

import { SortChange } from "../../../../actions/auction";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  SortToggle,
} from "../../../../components/App/Data/AuctionList/SortToggle";
import { IStoreState } from "../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { sortDirection, sortKind } = state.Auction;
  return { currentSortDirection: sortDirection, currentSortKind: sortKind };
};

const mapDispatchToProps: IDispatchProps = {
  onChange: SortChange,
};

export const SortToggleContainer = connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SortToggle);
