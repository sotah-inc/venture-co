import { connect } from "react-redux";

import {
  VersionEntrypoint,
  IOwnProps,
  IStateProps,
} from "../../components/entry-point/VersionEntrypoint";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentGameVersion, currentRegion } = state.Main;

  return { currentGameVersion, currentRegion };
}

export const VersionEntrypointContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IOwnProps,
  IStoreState
>(mapStateToProps)(VersionEntrypoint);
