import { connect } from "react-redux";

import { LoadRealmEntrypoint } from "../../actions/main";
import { LoadProfessionsEntrypoint, SetSkillTierCategoryIndex } from "../../actions/professions";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  Professions,
} from "../../components/entry-point/Professions";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion, currentRealm } = state.Main;
  const {
    professions,
    selectedProfession,
    selectedSkillTierCategoryIndex,
    selectedRecipe,
    selectedSkillTier,
  } = state.Professions;

  return {
    currentRealm,
    currentRegion,
    professions,
    selectedProfession,
    selectedRecipe: selectedRecipe?.data ?? null,
    selectedSkillTier,
    selectedSkillTierCategoryIndex,
  };
};

const mapDispatchToProps: IDispatchProps = {
  loadEntrypointData: LoadProfessionsEntrypoint,
  loadRealmEntrypoint: LoadRealmEntrypoint,
  setSkillTierCategoryIndex: SetSkillTierCategoryIndex,
};

export const ProfessionsContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(Professions);
