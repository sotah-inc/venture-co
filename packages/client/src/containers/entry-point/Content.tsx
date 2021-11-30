import { connect } from "react-redux";

import { SetVersionToggleConfig } from "../../actions/main";
import { Content, IDispatchProps, IRouteProps } from "../../components/entry-point/Content";
import { IStoreState } from "../../types";

const mapDispatchToProps: IDispatchProps = {
  setVersionToggleConfig: SetVersionToggleConfig,
};

export const ContentContainer = connect<
  Record<never, never>,
  IDispatchProps,
  IRouteProps,
  IStoreState
>(
  null,
  mapDispatchToProps,
)(Content);
