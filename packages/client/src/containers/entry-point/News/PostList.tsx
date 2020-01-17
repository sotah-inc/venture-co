import { connect } from "react-redux";

import { ChangeIsDeletePostDialogOpen } from "../../../actions/posts";
import {
  IDispatchProps,
  IStateProps,
  PostList,
} from "../../../components/entry-point/News/PostList";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile } = state.Main;
  const {
    posts: { data: posts, level: getPostsLevel },
  } = state.Posts;
  const user = profile === null ? null : profile.user;

  return { getPostsLevel, posts, user };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsDeletePostDialogOpen: ChangeIsDeletePostDialogOpen,
};

export const PostListContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(PostList);
