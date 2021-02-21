import { connect } from "react-redux";

import { SetSortQueryAuctions } from "../../../actions/auction";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  SortToggle,
} from "../../../components/entry-point/AuctionList/SortToggle";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    options: { sortDirection, sortKind },
  } = state.Auction;

  return { currentSortDirection: sortDirection, currentSortKind: sortKind };
}

const mapDispatchToProps: IDispatchProps = {
  onChange: SetSortQueryAuctions,
};

export const SortToggleContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(SortToggle);
