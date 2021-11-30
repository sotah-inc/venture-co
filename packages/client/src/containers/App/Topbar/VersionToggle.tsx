import { connect } from "react-redux";

import { IOwnProps, IStateProps, VersionToggle } from "../../../components/App/Topbar/VersionToggle";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { versionToggleConfig, currentGameVersion } = state.Main;

  return { versionToggleConfig, currentGameVersion };
}

export const VersionToggleContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IOwnProps,
  IStoreState
>(mapStateToProps)(VersionToggle);
