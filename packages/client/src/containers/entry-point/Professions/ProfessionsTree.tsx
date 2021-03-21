import { connect } from "react-redux";

import {
  DeselectSkillTierCategory,
  DeselectSkillTierFlag,
  SelectSkillTierCategory,
  SelectSkillTierFlag,
} from "../../../actions/professions";
import {
  IDispatchProps,
  IStateProps,
  ProfessionsTree,
} from "../../../components/entry-point/Professions/ProfessionsTree";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { currentRealm, currentRegion } = state.Main;
  const {
    selectedProfession,
    selectedSkillTier,
    selectedRecipe,
    selectedSkillTierCategory,
    selectedProfessionId,
    selectedRecipeId,
    loadId,
  } = state.Professions;

  return {
    currentRealm,
    currentRegion,
    loadId,
    selectedProfession,
    selectedProfessionId,
    selectedRecipe,
    selectedRecipeId,
    selectedSkillTier,
    selectedSkillTierCategory,
  };
}

const mapDispatchToProps: IDispatchProps = {
  deselectSkillTierCategory: DeselectSkillTierCategory,
  deselectSkillTierFlag: DeselectSkillTierFlag,
  selectSkillTierCategory: SelectSkillTierCategory,
  selectSkillTierFlag: SelectSkillTierFlag,
};

export const ProfessionsTreeContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(ProfessionsTree);
