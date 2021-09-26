import { connect } from "react-redux";

import { DebugInfo, IStateProps } from "../../components/App/DebugInfo";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { userData } = state.Main;

  return { userData };
}

export const DebugInfoContainer = connect<
  IStateProps,
  Record<string, never>,
  Record<string, never>,
  IStoreState
>(mapStateToProps)(DebugInfo);
