import { connect } from "react-redux";

import { ChangeIsDeletePostDialogOpen, FetchDeletePost } from "../../../actions/posts";
import {
  DeletePostDialog,
  IDispatchProps,
  IStateProps,
} from "../../../components/App/Content/DeletePostDialog";
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
};

export const DeletePostDialogContainer = connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeletePostDialog);
