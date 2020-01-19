import { connect } from "react-redux";

import {
  IStateProps,
  TokenHistoryGraph,
} from "../../../components/entry-point/News/TokenHistoryGraph";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { regionTokenHistories } = state.Posts;

  return { regionTokenHistories };
};

export const TokenHistoryGraphContainer = connect<IStateProps>(mapStateToProps)(TokenHistoryGraph);
