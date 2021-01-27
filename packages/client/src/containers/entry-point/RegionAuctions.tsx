import { IRegionComposite } from "@sotah-inc/core";
import { connect } from "react-redux";

import { LoadRegionEntrypoint, RegionChange } from "../../actions/main";
import {
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
  RegionAuctions,
} from "../../components/entry-point/RegionAuctions";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion, currentRealm, authLevel, regions, fetchRealmLevel } = state.Main;
  return {
    authLevel,
    currentRealm,
    currentRegion,
    fetchRealmLevel,
    regions: Object.values(regions).reduce<IRegionComposite[]>(
      (result, v) => (v === undefined ? result : [...result, v]),
      [],
    ),
  };
};

const mapDispatchToProps: IDispatchProps = {
  loadRegionEntrypoint: LoadRegionEntrypoint,
  onRegionChange: RegionChange,
};

export const RegionAuctionsContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps & IRouteProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(RegionAuctions);
