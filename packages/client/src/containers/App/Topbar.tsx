import { connect } from "react-redux";

import { IOwnProps, IStateProps, Topbar } from "../../components/App/Topbar";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    userData,
    currentRealm,
    currentRegion,
    currentGameVersion,
    currentExpansion,
  } = state.Main;

  return {
    userData,
    currentRealm,
    currentRegion,
    currentGameVersion,
    selectedExpansion: currentExpansion,
  };
}

export const TopbarContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IOwnProps,
  IStoreState
>(mapStateToProps)(Topbar);
