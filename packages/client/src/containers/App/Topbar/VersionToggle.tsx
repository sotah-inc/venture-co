import { connect } from "react-redux";

import { IOwnProps, IStateProps, VersionToggle } from "../../../components/App/Topbar/VersionToggle";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { versionToggleConfig } = state.Main;

  return { versionToggleConfig };
}

export const VersionToggleContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IOwnProps,
  IStoreState
>(mapStateToProps)(VersionToggle);
