import { connect } from "react-redux";

import { SetPerPageQueryAuctions } from "../../../actions/auction";
import {
  CountToggle,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/AuctionList/CountToggle";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const {
    options: { auctionsPerPage },
  } = state.Auction;

  return { auctionsPerPage };
};

const mapDispatchToProps: IDispatchProps = {
  onCountChange: SetPerPageQueryAuctions,
};

export const CountToggleContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(CountToggle);
