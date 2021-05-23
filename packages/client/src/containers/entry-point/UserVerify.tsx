import { connect } from "react-redux";

import { IRouteProps, IStateProps, UserVerify } from "../../components/entry-point/UserVerify";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { userData } = state.Main;

  return { userData };
}

export const UserVerifyContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IRouteProps,
  IStoreState
>(mapStateToProps)(UserVerify);
