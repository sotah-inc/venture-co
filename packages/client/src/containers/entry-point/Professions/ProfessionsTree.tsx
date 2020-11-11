import { connect } from "react-redux";

import {
  IStateProps,
  ProfessionsTree,
} from "../../../components/entry-point/Professions/ProfessionsTree";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRealm, currentRegion } = state.Main;
  const { professions, selectedProfession, selectedSkillTier } = state.Professions;

  return {
    currentRealm,
    currentRegion,
    professions,
    selectedProfession,
    selectedSkillTier,
  };
};

export const ProfessionsTreeContainer = connect<IStateProps, {}, {}, IStoreState>(mapStateToProps)(
  ProfessionsTree,
);
