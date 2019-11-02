import { connect } from "react-redux";

import { ChangeIsDeletePostDialogOpen, ReceiveGetPost } from "../../actions/posts";
import {
  IDispatchProps,
  IOwnProps,
  IRouteProps,
  IStateProps,
  Post,
} from "../../components/entry-point/Post";
import { IStoreState } from "../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile } = state.Main;
  const { currentPost, getPostLevel } = state.Posts;
  const user = profile === null ? null : profile.user;

  return { currentPost, getPostLevel, user };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsDeletePostDialogOpen: ChangeIsDeletePostDialogOpen,
  loadPost: ReceiveGetPost,
};

export const PostContainer = connect<
  IStateProps,
  IDispatchProps,
  IOwnProps & IRouteProps,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(Post);
