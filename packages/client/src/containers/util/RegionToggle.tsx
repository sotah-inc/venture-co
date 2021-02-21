import { connect } from "react-redux";

import { RegionChange } from "../../actions/main";
import { IDispatchProps, IStateProps, RegionToggle } from "../../components/util/RegionToggle";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { regions, currentRegion } = state.Main;
  return {
    currentRegion,
    regions,
  };
}

const mapDispatchToProps: IDispatchProps = {
  onRegionChange: RegionChange,
};

export const RegionToggleContainer = connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RegionToggle);
