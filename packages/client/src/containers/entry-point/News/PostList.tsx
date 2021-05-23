import { connect } from "react-redux";

import { ChangeIsDeletePostDialogOpen } from "../../../actions/posts";
import {
  IDispatchProps,
  IStateProps,
  PostList,
} from "../../../components/entry-point/News/PostList";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { userData } = state.Main;
  const {
    posts: { data: posts, level: getPostsLevel },
  } = state.Posts;

  return { getPostsLevel, posts, userData };
}

const mapDispatchToProps: IDispatchProps = {
  changeIsDeletePostDialogOpen: ChangeIsDeletePostDialogOpen,
};

export const PostListContainer = connect<
  IStateProps,
  IDispatchProps,
  Record<string, unknown>,
  IStoreState
>(
  mapStateToProps,
  mapDispatchToProps,
)(PostList);
