import { connect } from "react-redux";

import { FetchGetRealms, RegionChange } from "../../actions/main";
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
  fetchRealms: FetchGetRealms,
  onRegionChange: RegionChange,
};

export const ProfessionsLandingContainer = connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ProfessionsLanding);
