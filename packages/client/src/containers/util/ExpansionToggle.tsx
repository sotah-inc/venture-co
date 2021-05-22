import { connect } from "react-redux";

import { ExpansionToggle, IOwnProps, IStateProps } from "../../components/util/ExpansionToggle";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { bootData } = state.Main;
  const { selectedExpansion } = state.PriceLists;

  return {
    bootData,
    selectedExpansion,
  };
}

export const ExpansionToggleContainer = connect<IStateProps, Record<string, unknown>, IOwnProps>(
  mapStateToProps,
)(ExpansionToggle);
