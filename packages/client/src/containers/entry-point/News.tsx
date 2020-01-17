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

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { currentRegion, authLevel } = state.Main;
  const { regionTokenHistories } = state.Posts;

  return { currentRegion, authLevel, regionTokenHistories };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsRegisterDialogOpen: ChangeIsRegisterDialogOpen,
  loadEntrypointData: LoadPostsEntrypoint,
};

export const NewsContainer = connect<IStateProps, IDispatchProps, IOwnProps & IRouteProps>(
  mapStateToProps,
  mapDispatchToProps,
)(News);
