import { connect } from "react-redux";

import { CountChange } from "../../../../actions/auction";
import {
  CountToggle,
  IDispatchProps,
  IStateProps,
} from "../../../../components/App/Data/AuctionList/CountToggle";
import { IStoreState } from "../../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { auctionsPerPage } = state.Auction;
  return { auctionsPerPage };
};

const mapDispatchToProps: IDispatchProps = {
  onCountChange: CountChange,
};

export const CountToggleContainer = connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CountToggle);
