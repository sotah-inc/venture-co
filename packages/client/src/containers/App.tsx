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
