import { connect } from "react-redux";

import { ChangeIsRegisterDialogOpen } from "../../actions/main";
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
  const { userData, currentGameVersion, currentRegion, currentRealm } = state.Main;

  return { userData, currentGameVersion, currentRegion, currentRealm };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsRegisterDialogOpen: ChangeIsRegisterDialogOpen,
  loadEntrypointData: LoadPostsEntrypoint,
};

export const NewsContainer = connect<IStateProps, IDispatchProps, IOwnProps & IRouteProps>(
  mapStateToProps,
  mapDispatchToProps,
)(News);
