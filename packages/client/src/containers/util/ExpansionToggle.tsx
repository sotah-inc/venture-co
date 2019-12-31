import { connect } from "react-redux";

import { ExpansionToggle, IOwnProps, IStateProps } from "../../components/util/ExpansionToggle";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { expansions } = state.Main;
  const { selectedExpansion } = state.PriceLists;
  return {
    expansions,
    selectedExpansion,
  };
};

export const RealmToggleContainer = connect<IStateProps, {}, IOwnProps>(mapStateToProps)(
  ExpansionToggle,
);
