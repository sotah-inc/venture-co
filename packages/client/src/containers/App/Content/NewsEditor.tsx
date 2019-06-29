import { connect } from "react-redux";

import { FetchGetPost, FetchUpdatePost } from "../../../actions/posts";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  NewsEditor,
} from "../../../components/App/Content/NewsEditor";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile } = state.Main;
  const { currentPost, updatePostErrors, updatePostLevel, getPostLevel } = state.Posts;

  return { currentPost, getPostLevel, profile, updatePostErrors, updatePostLevel };
};

const mapDispatchToProps: IDispatchProps = {
  getPost: FetchGetPost,
  updatePost: FetchUpdatePost,
};

export const NewsEditorContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(NewsEditor);
