import { connect } from "react-redux";

import {
  ChangeAuthLevel,
  ChangeIsLoginDialogOpen,
  FetchGetUserPreferences,
  FetchUserReload,
  LoadRootEntrypoint,
} from "../actions/main";
import { InsertToast } from "../actions/oven";
import { App, IDispatchProps, IOwnProps, IStateProps } from "../components/App";
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
  changeAuthLevel: ChangeAuthLevel,
  changeIsLoginDialogOpen: ChangeIsLoginDialogOpen,
  insertToast: InsertToast,
  loadRootEntrypoint: LoadRootEntrypoint,
  loadUserPreferences: FetchGetUserPreferences,
  reloadUser: FetchUserReload,
};

export const AppContainer = connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(App);
