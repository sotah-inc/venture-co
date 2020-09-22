import { connect } from "react-redux";

import { IOwnProps, IStateProps, ProfessionToggle } from "../../components/util/ProfessionToggle";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { professions } = state.Main;
  const { selectedProfession } = state.PriceLists;

  return {
    professions,
    selectedProfession,
  };
};

export const ProfessionToggleContainer = connect<IStateProps, {}, IOwnProps>(mapStateToProps)(
  ProfessionToggle,
);
