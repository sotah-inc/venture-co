import { connect } from "react-redux";

import {
  IStateProps,
  TokenHistoryGraph,
} from "../../../components/entry-point/News/TokenHistoryGraph";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { bootData } = state.Main;
  const { tokenHistories } = state.Posts;

  return { bootData, tokenHistories };
}

export const TokenHistoryGraphContainer = connect<IStateProps>(mapStateToProps)(TokenHistoryGraph);
