import { connect } from "react-redux";

import {
  BaseEntrypoint,
  IOwnProps,
  IStateProps,
} from "../../components/entry-point/BaseEntrypoint";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentGameVersion } = state.Main;

  return { currentGameVersion };
}

export const BaseEntrypointContainer = connect<
  IStateProps,
  Record<string, unknown>,
  IOwnProps,
  IStoreState
>(mapStateToProps)(BaseEntrypoint);
