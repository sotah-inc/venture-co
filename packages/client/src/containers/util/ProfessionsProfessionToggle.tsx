import { connect } from "react-redux";

import {
  IOwnProps,
  IStateProps,
  ProfessionsProfessionToggle,
} from "../../components/util/ProfessionsProfessionToggle";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const {
    selectedProfession,
    professions: { data: professions },
  } = state.Professions;

  return {
    professions,
    selectedProfession,
  };
};

export const ProfessionsProfessionToggleContainer = connect<IStateProps, {}, IOwnProps>(
  mapStateToProps,
)(ProfessionsProfessionToggle);
