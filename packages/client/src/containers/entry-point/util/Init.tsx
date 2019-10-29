import { connect } from "react-redux";

import { LoadRootEntrypoint } from "../../../actions/main";
import {
  IDispatchProps,
  Init,
  IOwnProps,
  IStateProps,
} from "../../../components/entry-point/util/Init";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { fetchPingLevel, fetchBootLevel } = state.Main;

  return { fetchPingLevel, fetchBootLevel };
};

const mapDispatchToProps: IDispatchProps = {
  loadRootEntrypoint: LoadRootEntrypoint,
};

export const InitContainer = connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Init);
