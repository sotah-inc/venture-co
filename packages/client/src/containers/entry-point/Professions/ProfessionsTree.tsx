import { connect } from "react-redux";

import { SetSkillTierCategoryIndex } from "../../../actions/professions";
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
    selectedSkillTierCategoryIndex,
  } = state.Professions;

  return {
    currentRealm,
    currentRegion,
    selectedProfession,
    selectedRecipe,
    selectedSkillTier,
    selectedSkillTierCategoryIndex,
  };
};

const mapDispatchToProps: IDispatchProps = {
  setSkillTierCategoryIndex: SetSkillTierCategoryIndex,
};

export const ProfessionsTreeContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(ProfessionsTree);
