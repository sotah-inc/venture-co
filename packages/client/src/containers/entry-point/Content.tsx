import { connect } from "react-redux";

import { LoadRootEntrypoint } from "../../actions/main";
import {
  Content,
  IDispatchProps,
  IOwnProps,
  IStateProps,
} from "../../components/entry-point/Content";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { fetchPingLevel, fetchBootLevel } = state.Main;

  return { fetchPingLevel, fetchBootLevel };
};

const mapDispatchToProps: IDispatchProps = {
  loadRootEntrypoint: LoadRootEntrypoint,
};

export const ContentContainer = connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
