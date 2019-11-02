import { connect } from "react-redux";

import { InsertToast } from "../../../actions/oven";
import { ChangeIsDeletePostDialogOpen, FetchDeletePost } from "../../../actions/posts";
import {
  DeletePostDialog,
  IDispatchProps,
  IStateProps,
} from "../../../components/entry-point/News/DeletePostDialog";
import { IStoreState } from "../../../types";

const mapStateToProps = (state: IStoreState): IStateProps => {
  const { profile } = state.Main;
  const { deletePostLevel, isDeletePostDialogOpen, currentPost } = state.Posts;

  return {
    currentPost,
    deletePostLevel,
    isDeletePostDialogOpen,
    profile,
  };
};

const mapDispatchToProps: IDispatchProps = {
  changeIsDeletePostDialogOpen: ChangeIsDeletePostDialogOpen,
  deletePost: FetchDeletePost,
  insertToast: InsertToast,
};

export const DeletePostDialogContainer = connect<IStateProps, IDispatchProps, {}, IStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(DeletePostDialog);
