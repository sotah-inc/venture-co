import { connect } from "react-redux";

import { LoadVersionEntrypoint } from "../../actions/main";
import {
  VersionEntrypoint,
  IDispatchProps,
  IOwnProps,
  IStateProps,
} from "../../components/entry-point/VersionEntrypoint";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentGameVersion, currentRegion } = state.Main;

  return { currentGameVersion, currentRegion };
}

const mapDispatchToProps: IDispatchProps = {
  loadVersionEntrypoint: LoadVersionEntrypoint,
};

export const VersionEntrypointContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(VersionEntrypoint);
