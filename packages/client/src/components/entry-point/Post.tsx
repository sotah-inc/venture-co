import React from "react";

import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  Classes,
  H1,
  H2,
  H5,
  IBreadcrumbProps,
  Icon,
  Intent,
  NonIdealState,
  Spinner,
} from "@blueprintjs/core";
import { IGetPostResponseData, IPostJson, IUserJson, UserLevel } from "@sotah-inc/core";
import moment from "moment";

import { IDeletePostOptions } from "../../actions/posts";
import {
  DeletePostDialogRouteContainer,
} from "../../route-containers/entry-point/News/DeletePostDialog";
import { FetchLevel } from "../../types/main";
import { setTitle } from "../../util";
import { MarkdownRenderer } from "../util";

export interface IStateProps {
  currentPost: IPostJson | null;
  getPostLevel: FetchLevel;
  user: IUserJson | null;
}

export interface IDispatchProps {
  changeIsDeletePostDialogOpen: (v: IDeletePostOptions) => void;
  loadPost: (payload: IGetPostResponseData | null) => void;
}

export interface IOwnProps {
  postPayload: IGetPostResponseData | null;
}

export interface IRouteParams {
  post_slug?: string;
}

export interface IRouteProps {
  routeParams: IRouteParams;
  browseToHome: () => void;
  browseToNews: () => void;
  browseToPostEdit: (post: IPostJson) => void;
}

export type Props = Readonly<IDispatchProps & IStateProps & IOwnProps & IRouteProps>;

export class Post extends React.Component<Props> {
  public componentDidMount(): void {
    // props
    const { loadPost, postPayload } = this.props;

    loadPost(postPayload);
  }

  public componentDidUpdate() {
    // props
    const { getPostLevel, currentPost } = this.props;

    if (getPostLevel !== FetchLevel.success) {
      return;
    }

    if (currentPost === null) {
      return;
    }

    setTitle(`${currentPost.title} - News`);
  }

  public render(): React.ReactNode {
    return (
      <>
        <DeletePostDialogRouteContainer />
        <div className="pure-g">
          <div className="pure-u-3-4">
            <H1>
              <Icon icon="globe" iconSize={35} /> Secrets of the Auction House
            </H1>
            {this.renderBreadcrumbs()}
            {this.renderContent()}
          </div>
        </div>
        <div className="pure-u-1-4">&nbsp;</div>
      </>
    );
  }

  private renderBreadcrumbs() {
    const { currentPost, browseToHome, browseToNews } = this.props;

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
        text: currentPost.title,
      },
    ];

    return (
      <div style={{ marginBottom: "10px" }}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
    );
  }

  private renderContent() {
    const {
      routeParams: { post_slug },
      getPostLevel,
      currentPost,
    } = this.props;

    if (typeof post_slug === "undefined") {
      return (
        <NonIdealState
          title="News post not found"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={1} />}
        />
      );
    }

    switch (getPostLevel) {
    case FetchLevel.success:
      break;
    case FetchLevel.failure:
      return (
        <NonIdealState
          title="Failed to fetch news post"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />
      );
    case FetchLevel.fetching:
      return (
        <NonIdealState
          title="Loading news post"
          icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
        />
      );
    case FetchLevel.initial:
    default:
      return (
        <NonIdealState
          title="Loading news post"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
        />
      );
    }

    if (currentPost === null) {
      return (
        <NonIdealState
          title="Loading news post"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
        />
      );
    }

    if (currentPost.slug !== post_slug) {
      return (
        <NonIdealState
          title="Changing news post"
          description={`Browsing to ${post_slug}`}
          icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
        />
      );
    }

    return (
      <Card elevation={3}>
        <H2>{currentPost.title}</H2>
        <H5>
          <small>
            Submitted {moment(new Date(currentPost.createdAt * 1000)).format("MMM Do YYYY")}
          </small>
        </H5>
        {this.renderActionBar()}
        <hr />
        <MarkdownRenderer body={currentPost.body} />
      </Card>
    );
  }

  private renderActionBar() {
    const { user, currentPost, browseToPostEdit, changeIsDeletePostDialogOpen } = this.props;

    if (user === null || user.level < UserLevel.Admin) {
      return null;
    }

    if (currentPost === null) {
      return null;
    }

    return (
      <>
        <hr />
        <ButtonGroup>
          <Button icon="edit" text="Edit" onClick={() => browseToPostEdit(currentPost)} />
          <Button
            icon="delete"
            onClick={() => changeIsDeletePostDialogOpen({ isOpen: true, post: currentPost })}
          />
        </ButtonGroup>
      </>
    );
  }
}
