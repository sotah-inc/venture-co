import { connect } from "react-redux";

import { LoadRootEntrypoint } from "../../actions/main";
import { IDispatchProps, IOwnProps, IStateProps, Root } from "../../components/entry-point/Root";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { fetchPingLevel, fetchBootLevel } = state.Main;

  return { fetchPingLevel, fetchBootLevel };
};

const mapDispatchToProps: IDispatchProps = {
  loadRootEntrypoint: LoadRootEntrypoint,
};

export const RootContainer = connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Root);
