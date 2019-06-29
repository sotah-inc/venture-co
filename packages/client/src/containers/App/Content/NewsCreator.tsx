import { connect } from "react-redux";

import { FetchCreatePost } from "../../../actions/posts";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  NewsCreator,
} from "../../../components/App/Content/NewsCreator";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile } = state.Main;
  const { createPostLevel, createPostErrors, currentPost } = state.Posts;

  return { createPostErrors, createPostLevel, currentPost, profile };
};

const mapDispatchToProps: IDispatchProps = {
  createPost: FetchCreatePost,
};

export const NewsCreatorContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(NewsCreator);
