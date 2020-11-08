import { connect } from "react-redux";

import { LoadRealmEntrypoint } from "../../actions/main";
import { LoadProfessionsEntrypoint } from "../../actions/professions";
import {
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
  Professions,
} from "../../components/entry-point/Professions";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { professions } = state.Professions;

  return { professions };
};

const mapDispatchToProps: IDispatchProps = {
  loadEntrypointData: LoadProfessionsEntrypoint,
  loadRealmEntrypoint: LoadRealmEntrypoint,
};

export const ProfessionsContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps & IRouteProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(Professions);
