import { connect } from "react-redux";

import { ChangeIsDeletePostDialogOpen, FetchGetPosts } from "../../../actions/posts";
import { IDispatchProps, IStateProps, PostList } from "../../../components/App/Content/PostList";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile } = state.Main;
  const { posts, getPostsLevel } = state.Posts;
  const user = profile === null ? null : profile.user;

  return { getPostsLevel, posts, user };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsDeletePostDialogOpen: ChangeIsDeletePostDialogOpen,
  refreshPosts: FetchGetPosts,
};

export const PostListContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(PostList);
