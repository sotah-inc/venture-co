import { connect } from "react-redux";

import { ChangeIsRegisterDialogOpen, LoadRootEntrypoint } from "../../actions/main";
import { IDispatchProps, IOwnProps, IStateProps, News } from "../../components/entry-point/News";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion, authLevel, fetchBootLevel, fetchPingLevel } = state.Main;
  return { currentRegion, authLevel, fetchBootLevel, fetchPingLevel };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsRegisterDialogOpen: ChangeIsRegisterDialogOpen,
  loadRootEntrypoint: LoadRootEntrypoint,
};

export const NewsContainer = connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(News);
