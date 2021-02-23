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
import { IPostJson, UpdatePostRequest, UserLevel } from "@sotah-inc/core";

import { PostFormFormContainer } from "../../../form-containers/entry-point/Content/PostForm";
import { IErrors, IProfile } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { setTitle } from "../../../util";
import { IFormValues } from "./PostForm";

export interface IStateProps {
  profile: IProfile | null;
  currentPost: IPostJson | null;
  updatePostLevel: FetchLevel;
  updatePostErrors: IErrors;
  getPostLevel: FetchLevel;
}

export interface IDispatchProps {
  getPost: (slug: string) => void;
  updatePost: (token: string, postId: number, v: UpdatePostRequest) => void;
  insertToast: (toast: IToastProps) => void;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  browseToHome: () => void;
  browseToPost: (post: IPostJson) => void;
  browseToNews: () => void;
}

export interface IRouteParams {
  post_slug?: string;
}

export type IOwnProps = IRouteProps;

type Props = Readonly<IDispatchProps & IStateProps & IOwnProps>;

export class NewsEditor extends React.Component<Props> {
  public componentDidMount(): void {
    this.handle();
  }

  public componentDidUpdate(prevProps: Props): void {
    this.handle(prevProps);
  }

  public render(): React.ReactNode {
    const {
      routeParams: { post_slug },
      profile,
      updatePost,
      updatePostLevel,
      currentPost,
      updatePostErrors,
      getPostLevel,
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

    switch (getPostLevel) {
    case FetchLevel.success:
      if (
        currentPost !== null &&
          typeof post_slug !== "undefined" &&
          currentPost.slug === post_slug
      ) {
        break;
      }

      return (
        <NonIdealState
          title="Switching to new post."
          icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
        />
      );
    case FetchLevel.fetching:
      return (
        <NonIdealState
          title="Loading post."
          icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
        />
      );
    case FetchLevel.failure:
      return (
        <NonIdealState
          title="Failed to load post."
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    default:
    case FetchLevel.initial:
      return (
        <NonIdealState
          title="Loading post."
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
        />
      );
    }

    return (
      <>
        <H2>News Editor</H2>
        {this.renderBreadcrumbs()}
        <PostFormFormContainer
          mutatePostLevel={updatePostLevel}
          mutatePostErrors={updatePostErrors}
          defaultFormValues={currentPost}
          onSubmit={(v: IFormValues) => updatePost(profile.token, currentPost.id, v)}
          onComplete={() => {
            return;
          }}
          onFatalError={err => {
            insertToast({
              icon: "warning-sign",
              intent: "danger",
              message: `Could not update post: ${err}`,
            });
          }}
        />
      </>
    );
  }

  private renderBreadcrumbs() {
    const { browseToHome, currentPost, browseToNews, browseToPost } = this.props;

    if (currentPost === null) {
      return;
    }

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
        href: `/content/news/${currentPost.slug}`,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();

          browseToPost(currentPost);
        },
        text: currentPost.title,
      },
      {
        text: "News Editor",
      },
    ];

    return (
      <div style={{ marginBottom: "10px" }}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
    );
  }

  private handle(prevProps?: Props) {
    const {
      routeParams: { post_slug },
      currentPost,
      getPost,
      getPostLevel,
      profile,
      updatePostLevel,
      browseToPost,
      insertToast,
    } = this.props;

    if (profile === null || profile.user.level < UserLevel.Admin) {
      return;
    }

    if (typeof post_slug === "undefined") {
      return;
    }

    if (typeof prevProps !== "undefined" && prevProps.updatePostLevel !== updatePostLevel) {
      switch (updatePostLevel) {
      case FetchLevel.success:
        if (prevProps.updatePostLevel !== FetchLevel.fetching) {
          return;
        }

        if (currentPost === null) {
          return;
        }

        insertToast({
          icon: "info-sign",
          intent: "success",
          message: "Your post has successfully been updated!",
        });

        browseToPost(currentPost);

        return;
      default:
        return;
      }
    }

    switch (getPostLevel) {
    case FetchLevel.initial:
      getPost(post_slug);

      return;
    case FetchLevel.failure:
      if (typeof prevProps !== "undefined" && prevProps.getPostLevel !== getPostLevel) {
        insertToast({
          icon: "warning-sign",
          intent: "danger",
          message: "Could not fetch post.",
        });

        return;
      }

      if (currentPost === null || currentPost.slug !== post_slug) {
        getPost(post_slug);

        return;
      }

      return;
    case FetchLevel.success:
      if (currentPost === null) {
        return;
      }

      if (currentPost.slug !== post_slug) {
        getPost(post_slug);

        return;
      }

      break;
    default:
      return;
    }

    setTitle(`Editing ${currentPost.title} - News`);
  }
}
