import { connect } from "react-redux";

import { LoadRootEntrypoint } from "../../actions/main";
import { IDispatchProps, IOwnProps, Root } from "../../components/entry-point/Root";
import { IStoreState } from "../../types";

const mapStateToProps = (_state: IStoreState) => {
  return {};
};

const mapDispatchToProps: IDispatchProps = {
  loadRootEntrypoint: LoadRootEntrypoint,
};

export const RootContainer = connect<void, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Root);
