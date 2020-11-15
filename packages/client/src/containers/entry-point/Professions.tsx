import { connect } from "react-redux";

import { LoadRealmEntrypoint } from "../../actions/main";
import {
  DeselectSkillTierCategory,
  LoadProfessionsEntrypoint,
  SelectSkillTierCategory,
} from "../../actions/professions";
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
    selectedSkillTierCategory,
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
    selectedSkillTierCategory,
  };
};

const mapDispatchToProps: IDispatchProps = {
  deselectSkillTierCategory: DeselectSkillTierCategory,
  loadEntrypointData: LoadProfessionsEntrypoint,
  loadRealmEntrypoint: LoadRealmEntrypoint,
  selectSkillTierCategory: SelectSkillTierCategory,
};

export const ProfessionsContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(Professions);
