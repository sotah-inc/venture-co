import { connect } from "react-redux";

import {
  IStateProps,
  TokenHistoryGraph,
} from "../../../components/entry-point/News/TokenHistoryGraph";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { regions } = state.Main;
  const { tokenHistories } = state.Posts;

  return { regions, tokenHistories };
};

export const TokenHistoryGraphContainer = connect<IStateProps>(mapStateToProps)(TokenHistoryGraph);
