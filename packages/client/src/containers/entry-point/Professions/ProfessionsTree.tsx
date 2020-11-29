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

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRealm, currentRegion } = state.Main;
  const {
    selectedProfession,
    selectedSkillTier,
    selectedRecipe,
    selectedSkillTierCategory,
    selectedProfessionId,
  } = state.Professions;

  return {
    currentRealm,
    currentRegion,
    selectedProfession,
    selectedProfessionId,
    selectedRecipe,
    selectedSkillTier,
    selectedSkillTierCategory,
  };
};

const mapDispatchToProps: IDispatchProps = {
  deselectSkillTierCategory: DeselectSkillTierCategory,
  deselectSkillTierFlag: DeselectSkillTierFlag,
  selectSkillTierCategory: SelectSkillTierCategory,
  selectSkillTierFlag: SelectSkillTierFlag,
};

export const ProfessionsTreeContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(ProfessionsTree);
