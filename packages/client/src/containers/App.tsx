import { connect } from "react-redux";

import {
  ChangeAuthLevel,
  ChangeIsLoginDialogOpen,
  FetchGetBoot,
  FetchGetPing,
  FetchGetUserPreferences,
  FetchUserReload,
} from "../actions/main";
import { InsertToast } from "../actions/oven";
import { App, IDispatchProps, IStateProps } from "../components/App";
import { IStoreState } from "../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const {
    fetchBootLevel,
    fetchPingLevel,
    currentRegion,
    fetchRealmLevel,
    currentRealm,
    preloadedToken,
    authLevel,
    isLoginDialogOpen,
    fetchUserPreferencesLevel,
    userPreferences,
    profile,
  } = state.Main;
  return {
    authLevel,
    currentRealm,
    currentRegion,
    fetchBootLevel,
    fetchPingLevel,
    fetchRealmLevel,
    fetchUserPreferencesLevel,
    isLoginDialogOpen,
    preloadedToken,
    profile,
    userPreferences,
  };
};

const mapDispatchToProps: IDispatchProps = {
  boot: FetchGetBoot,
  changeAuthLevel: ChangeAuthLevel,
  changeIsLoginDialogOpen: ChangeIsLoginDialogOpen,
  insertToast: InsertToast,
  loadUserPreferences: FetchGetUserPreferences,
  onLoad: FetchGetPing,
  reloadUser: FetchUserReload,
};

export const AppContainer = connect<IStateProps, IDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
)(App);
