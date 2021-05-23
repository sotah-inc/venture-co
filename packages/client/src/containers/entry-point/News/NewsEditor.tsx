import { connect } from "react-redux";

import { InsertToast } from "../../../actions/oven";
import { FetchGetPost, FetchUpdatePost } from "../../../actions/posts";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  NewsEditor,
} from "../../../components/entry-point/News/NewsEditor";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { userData } = state.Main;
  const { currentPost, updatePostErrors, updatePostLevel, getPostLevel } = state.Posts;

  return { currentPost, getPostLevel, userData, updatePostErrors, updatePostLevel };
}

const mapDispatchToProps: IDispatchProps = {
  getPost: FetchGetPost,
  insertToast: InsertToast,
  updatePost: FetchUpdatePost,
};

export const NewsEditorContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(NewsEditor);
