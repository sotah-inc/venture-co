import * as React from "react";

import { Button, Callout, Dialog, Intent } from "@blueprintjs/core";

import { IDeletePostOptions } from "../../../actions/posts";
import { IPostJson } from "../../../api-types/entities";
import { IProfile } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { GetAppToaster } from "../../../util/toasters";
import { DialogActions, DialogBody } from "../../util";

export interface IStateProps {
  profile: IProfile | null;
  isDeletePostDialogOpen: boolean;
  deletePostLevel: FetchLevel;
  currentPost: IPostJson | null;
}

export interface IDispatchProps {
  changeIsDeletePostDialogOpen: (v: IDeletePostOptions) => void;
  deletePost: (token: string, id: number) => void;
}

export interface IRouteProps {
  browseToNews: () => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class DeletePostDialog extends React.Component<Props> {
  public componentDidUpdate(prevProps: Props) {
    const { browseToNews, deletePostLevel } = this.props;

    if (prevProps.deletePostLevel !== deletePostLevel) {
      switch (deletePostLevel) {
        case FetchLevel.success:
          const AppToaster = GetAppToaster(true);
          if (AppToaster !== null) {
            AppToaster.show({
              icon: "info-sign",
              intent: Intent.SUCCESS,
              message: "Your post has been deleted.",
            });
          }

          browseToNews();

          return;
        default:
          return;
      }
    }
  }

  public render() {
    const {
      isDeletePostDialogOpen,
      changeIsDeletePostDialogOpen,
      currentPost,
      deletePostLevel,
    } = this.props;

    if (currentPost === null) {
      return null;
    }

    return (
      <Dialog
        isOpen={isDeletePostDialogOpen}
        onClose={() =>
          changeIsDeletePostDialogOpen({ post: currentPost, isOpen: isDeletePostDialogOpen })
        }
        title="Delete List"
        icon="delete"
      >
        <DialogBody>
          <Callout intent={Intent.DANGER} icon="info-sign">
            Are you sure you want to delete "{currentPost.title}"
          </Callout>
        </DialogBody>
        <DialogActions>
          <Button text="Cancel" intent={Intent.NONE} onClick={() => this.onDialogCancel()} />
          <Button
            type="submit"
            intent={Intent.DANGER}
            icon="delete"
            text={`Delete "${currentPost.title}"`}
            onClick={() => this.onDialogConfirm()}
            disabled={deletePostLevel === FetchLevel.fetching}
          />
        </DialogActions>
      </Dialog>
    );
  }

  private onDialogCancel() {
    const { changeIsDeletePostDialogOpen, currentPost } = this.props;

    if (currentPost === null) {
      return;
    }

    changeIsDeletePostDialogOpen({ post: currentPost, isOpen: false });
  }

  private onDialogConfirm() {
    const { profile, deletePost, currentPost } = this.props;

    if (profile === null || currentPost === null) {
      return;
    }

    deletePost(profile.token, currentPost.id);
  }
}
