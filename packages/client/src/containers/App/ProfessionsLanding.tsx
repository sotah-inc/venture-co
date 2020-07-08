import { connect } from "react-redux";

import { FetchGetConnectedRealms, RegionChange } from "../../actions/main";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  ProfessionsLanding,
} from "../../components/App/ProfessionsLanding";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRealm, currentRegion, fetchRealmLevel, regions } = state.Main;
  return { currentRealm, currentRegion, fetchRealmLevel, regions };
};

const mapDispatchToProps: IDispatchProps = {
  fetchRealms: FetchGetConnectedRealms,
  onRegionChange: RegionChange,
};

export const ProfessionsLandingContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(ProfessionsLanding);
