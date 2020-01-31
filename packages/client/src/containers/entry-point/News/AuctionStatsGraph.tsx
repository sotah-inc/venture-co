import { connect } from "react-redux";

import {
  AuctionStatsGraph,
  IStateProps,
} from "../../../components/entry-point/News/AuctionStatsGraph";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { auctionStats } = state.Posts;

  return { auctionStats };
};

export const AuctionStatsGraphContainer = connect<IStateProps>(mapStateToProps)(AuctionStatsGraph);
