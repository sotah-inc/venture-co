import { connect } from "react-redux";

import { RegionChange } from "../../actions/main";
import { IDispatchProps, IStateProps, RegionToggle } from "../../components/util/RegionToggle";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { bootData, currentRegion } = state.Main;

  return {
    bootData,
    currentRegion,
  };
}

const mapDispatchToProps: IDispatchProps = {
  onRegionChange: RegionChange,
};

export const RegionToggleContainer = connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RegionToggle);
