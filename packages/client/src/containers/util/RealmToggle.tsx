import { connect } from "react-redux";

import { FetchUserPreferencesCreate, FetchUserPreferencesUpdate } from "../../actions/main";
import { IDispatchProps, IStateProps, RealmToggle } from "../../components/util/RealmToggle";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    realms,
    currentRealm,
    fetchRealmLevel,
    userPreferences,
    authLevel,
    profile,
    currentRegion,
  } = state.Main;
  return {
    authLevel,
    currentRealm,
    currentRegion,
    fetchRealmLevel,
    profile,
    realms,
    userPreferences,
  };
}

const mapDispatchToProps: IDispatchProps = {
  createUserPreferences: FetchUserPreferencesCreate,
  updateUserPreferences: FetchUserPreferencesUpdate,
};

export const RealmToggleContainer = connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RealmToggle);
