import { connect } from "react-redux";

import {
  ChangeIsLoginDialogOpen,
  FetchGetUserPreferences,
  LoadRootEntrypoint,
} from "../actions/main";
import { InsertToast } from "../actions/oven";
import { AppWithCookies, IDispatchProps, IOwnProps, IStateProps } from "../components/App";
import { IStoreState } from "../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    bootData,
    currentRegion,
    currentRealm,
    userData,
    userPreferences,
    isLoginDialogOpen,
  } = state.Main;

  return {
    bootData,
    currentRegion,
    currentRealm,
    userData,
    userPreferences,
    isLoginDialogOpen,
  };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsLoginDialogOpen: ChangeIsLoginDialogOpen,
  insertToast: InsertToast,
  loadRootEntrypoint: LoadRootEntrypoint,
  loadUserPreferences: FetchGetUserPreferences,
};

export const AppContainer = connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(AppWithCookies);
