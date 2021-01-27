import { connect } from "react-redux";

import {
  BaseProfessions,
  IOwnProps,
  IStateProps,
} from "../../components/entry-point/BaseProfessions";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion } = state.Main;
  return { currentRegion };
};

export const BaseProfessionsContainer = connect<IStateProps, {}, IOwnProps, IStoreState>(
  mapStateToProps,
)(BaseProfessions);
