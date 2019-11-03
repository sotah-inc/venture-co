import { connect } from "react-redux";

import { LoadRegionEntrypoint, RegionChange } from "../../actions/main";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  Region,
} from "../../components/entry-point/Region";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion, currentRealm, authLevel, regions, fetchRealmLevel } = state.Main;
  return { currentRegion, currentRealm, authLevel, regions, fetchRealmLevel };
};

const mapDispatchToProps: IDispatchProps = {
  loadRegionEntrypoint: LoadRegionEntrypoint,
  onRegionChange: RegionChange,
};

export const RegionContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(Region);
