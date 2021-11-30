import { connect } from "react-redux";

import { ChangeIsRegisterDialogOpen, SetVersionToggleConfig } from "../../actions/main";
import { LoadPostsEntrypoint } from "../../actions/posts";
import {
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
  News,
} from "../../components/entry-point/News";
import { IStoreState } from "../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { userData } = state.Main;

  return { userData };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsRegisterDialogOpen: ChangeIsRegisterDialogOpen,
  loadEntrypointData: LoadPostsEntrypoint,
  setVersionToggleConfig: SetVersionToggleConfig,
};

export const NewsContainer = connect<IStateProps, IDispatchProps, IOwnProps & IRouteProps>(
  mapStateToProps,
  mapDispatchToProps,
)(News);
