import { connect } from "react-redux";

import { LoadRegionEntrypoint, RegionChange } from "../../actions/main";
import {
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
  RegionEntrypoint,
} from "../../components/entry-point/RegionEntrypoint";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const {
    currentGameVersion,
    currentRegion,
    currentRealm,
    bootData,
    realms,
    userData,
  } = state.Main;

  return {
    currentGameVersion,
    currentRealm,
    currentRegion,
    bootData,
    realms,
    userData,
  };
}

const mapDispatchToProps: IDispatchProps = {
  loadRegionEntrypoint: LoadRegionEntrypoint,
  onRegionChange: RegionChange,
};

export const RegionEntrypointContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps & IRouteProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(RegionEntrypoint);
