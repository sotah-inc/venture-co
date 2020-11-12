import { connect } from "react-redux";

import {
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

export const ProfessionsTreeContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(
  ProfessionsTree,
);
