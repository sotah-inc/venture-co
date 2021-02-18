import React from "react";

import {
  Breadcrumbs,
  Classes,
  H2,
  IBreadcrumbProps,
  Intent,
  IToastProps,
  NonIdealState,
  Spinner,
} from "@blueprintjs/core";
import { ICreatePostRequest, IPostJson, UserLevel } from "@sotah-inc/core";

import { PostFormFormContainer } from "../../../form-containers/entry-point/Content/PostForm";
import { IErrors, IProfile } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { setTitle } from "../../../util";
import { IFormValues } from "./PostForm";

export interface IStateProps {
  profile: IProfile | null;
  currentPost: IPostJson | null;
  createPostLevel: FetchLevel;
  createPostErrors: IErrors;
}

export interface IDispatchProps {
  createPost: (token: string, v: ICreatePostRequest) => void;
  insertToast: (toast: IToastProps) => void;
}

export interface IRouteProps {
  browseToPost: (post: IPostJson) => void;
  browseToHome: () => void;
  browseToNews: () => void;
}

export type IOwnProps = IRouteProps;

type Props = Readonly<IDispatchProps & IStateProps & IOwnProps>;

export class NewsCreator extends React.Component<Props> {
  public componentDidMount() {
    setTitle("News Creator");
  }

  public render(): React.ReactNode {
    const {
      profile,
      createPost,
      createPostLevel,
      createPostErrors,
      browseToPost,
      currentPost,
      insertToast,
    } = this.props;

    if (profile === null || profile.user.level < UserLevel.Admin) {
      return (
        <NonIdealState
          title="Unauthorized."
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    }

    return (
      <>
        <H2>News Creator</H2>
        {this.renderBreadcrumbs()}
        <PostFormFormContainer
          mutatePostLevel={createPostLevel}
          mutatePostErrors={createPostErrors}
          onSubmit={(v: IFormValues) => createPost(profile.token, v)}
          onComplete={() => {
            if (currentPost === null) {
              return;
            }

            insertToast({
              icon: "info-sign",
              intent: "success",
              message: "Your post has successfully been created!",
            });

            browseToPost(currentPost);
          }}
          onFatalError={err => {
            insertToast({
              icon: "warning-sign",
              intent: "danger",
              message: `Could not create post: ${err}`,
            });
          }}
        />
      </>
    );
  }

  private renderBreadcrumbs() {
    const { browseToHome, browseToNews } = this.props;

    const breadcrumbs: IBreadcrumbProps[] = [
      {
        href: "/",
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();

          browseToHome();
        },
        text: "Home",
      },
      {
        href: "/content/news",
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();

          browseToNews();
        },
        text: "News",
      },
      {
        text: "News Creator",
      },
    ];

    return (
      <div style={{ marginBottom: "10px" }}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
    );
  }
}
