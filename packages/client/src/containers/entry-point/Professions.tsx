import { connect } from "react-redux";

import { LoadRealmEntrypoint } from "../../actions/main";
import { LoadProfessionsEntrypoint } from "../../actions/professions";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  Professions,
} from "../../components/entry-point/Professions";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
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
    selectedRecipe,
    selectedSkillTier,
    selectedSkillTierCategory,
  };
}

const mapDispatchToProps: IDispatchProps = {
  loadEntrypointData: LoadProfessionsEntrypoint,
  loadRealmEntrypoint: LoadRealmEntrypoint,
};

export const ProfessionsContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(Professions);
