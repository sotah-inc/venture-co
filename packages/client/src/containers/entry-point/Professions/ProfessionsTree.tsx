import { connect } from "react-redux";

import { DeselectSkillTierCategory, SelectSkillTierCategory } from "../../../actions/professions";
import {
  IDispatchProps,
  IStateProps,
  ProfessionsTree,
} from "../../../components/entry-point/Professions/ProfessionsTree";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRealm, currentRegion } = state.Main;
  const {
    selectedProfession,
    selectedSkillTier,
    selectedRecipe,
    selectedSkillTierCategory,
  } = state.Professions;

  return {
    currentRealm,
    currentRegion,
    selectedProfession,
    selectedRecipe,
    selectedSkillTier,
    selectedSkillTierCategory,
  };
};

const mapDispatchToProps: IDispatchProps = {
  deselectSkillTierCategory: DeselectSkillTierCategory,
  selectSkillTierCategory: SelectSkillTierCategory,
};

export const ProfessionsTreeContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(ProfessionsTree);
