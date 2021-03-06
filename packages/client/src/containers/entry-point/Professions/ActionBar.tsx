import { connect } from "react-redux";

import { ActionBar, IStateProps } from "../../../components/entry-point/Professions/ActionBar";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentRegion, currentRealm } = state.Main;
  const { selectedProfession, selectedSkillTier, selectedRecipe } = state.Professions;

  return {
    currentRealm,
    currentRegion,
    selectedProfession,
    selectedRecipe,
    selectedSkillTier,
  };
}

export const ActionBarContainer = connect<
  IStateProps,
  Record<string, unknown>,
  Record<string, unknown>,
  IStoreState
>(mapStateToProps)(ActionBar);
