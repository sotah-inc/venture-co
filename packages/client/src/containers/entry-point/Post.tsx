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

function mapStateToProps(state: IStoreState): IStateProps {
  const { userData } = state.Main;
  const { currentPost, getPostLevel } = state.Posts;

  return { currentPost, getPostLevel, userData };
}

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
