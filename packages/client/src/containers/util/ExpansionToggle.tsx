import { connect } from "react-redux";

import { ExpansionToggle, IOwnProps, IStateProps } from "../../components/util/ExpansionToggle";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { regionData: { data: { expansions } } } = state.Main;
  const { selectedExpansion } = state.PriceLists;

  return {
    expansions,
    selectedExpansion,
  };
}

export const ExpansionToggleContainer = connect<IStateProps, Record<string, unknown>, IOwnProps>(
  mapStateToProps,
)(ExpansionToggle);
