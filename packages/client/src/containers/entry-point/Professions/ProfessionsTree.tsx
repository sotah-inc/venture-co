import { connect } from "react-redux";

import { SetSkillSetCategoryIndex } from "../../../actions/professions";
import {
  IDispatchProps,
  IStateProps,
  ProfessionsTree,
} from "../../../components/entry-point/Professions/ProfessionsTree";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRealm, currentRegion } = state.Main;
  const {
    professions,
    selectedProfession,
    selectedSkillTier,
    selectedRecipe,
    selectedSkillTierCategoryIndex,
  } = state.Professions;

  return {
    currentRealm,
    currentRegion,
    professions,
    selectedProfession,
    selectedRecipe,
    selectedSkillTier,
    selectedSkillTierCategoryIndex,
  };
};

const mapDispatchToProps: IDispatchProps = {
  setSkillTierCategoryIndex: SetSkillSetCategoryIndex,
};

export const ProfessionsTreeContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(ProfessionsTree);
