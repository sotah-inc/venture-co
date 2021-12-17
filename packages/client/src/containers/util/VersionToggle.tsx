import { connect } from "react-redux";

import {
  IOwnProps,
  IRouteProps,
  IStateProps,
  VersionToggle,
} from "../../components/util/VersionToggle";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentGameVersion, bootData } = state.Main;

  return { currentGameVersion, gameVersions: bootData.data.version_meta.map(v => v.name) };
}

export const VersionToggleContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IOwnProps & IRouteProps,
  IStoreState
>(mapStateToProps)(VersionToggle);
