import { connect } from "react-redux";

import { Content, IRouteProps } from "../../components/entry-point/Content";
import { IStoreState } from "../../types";

export const ContentContainer = connect<
  Record<never, never>,
  Record<never, never>,
  IRouteProps,
  IStoreState
>(
  null,
)(Content);
