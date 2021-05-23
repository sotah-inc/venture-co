import { connect } from "react-redux";

import { InsertToast } from "../../../actions/oven";
import { FetchCreatePost } from "../../../actions/posts";
import {
  IDispatchProps,
  IOwnProps,
  IStateProps,
  NewsCreator,
} from "../../../components/entry-point/News/NewsCreator";
import { IStoreState } from "../../../types";

function mapStateToProps(state: IStoreState): IStateProps {
  const { userData } = state.Main;
  const { createPostLevel, createPostErrors, currentPost } = state.Posts;

  return { createPostErrors, createPostLevel, currentPost, userData };
}

const mapDispatchToProps: IDispatchProps = {
  createPost: FetchCreatePost,
  insertToast: InsertToast,
};

export const NewsCreatorContainer = connect<IStateProps, IDispatchProps, IOwnProps, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(NewsCreator);
