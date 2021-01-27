import { connect } from "react-redux";

import {
  BaseEntrypoint,
  IOwnProps,
  IStateProps,
} from "../../components/entry-point/BaseEntrypoint";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion } = state.Main;
  return { currentRegion };
};

export const BaseEntrypointContainer = connect<IStateProps, {}, IOwnProps, IStoreState>(
  mapStateToProps,
)(BaseEntrypoint);
