import { connect } from "react-redux";

import { LoadRealmEntrypoint } from "../../actions/main";
import {
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
  Realm,
} from "../../components/entry-point/Realm";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { fetchRealmLevel, realms, currentRegion, currentRealm, authLevel, regions } = state.Main;
  return { realms, fetchRealmLevel, currentRegion, currentRealm, authLevel, regions };
};

const mapDispatchToProps: IDispatchProps = {
  loadRealmEntrypoint: LoadRealmEntrypoint,
};

export const RealmContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps & IRouteProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(Realm);
