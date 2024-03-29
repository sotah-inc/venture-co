import React from "react";

import { Button, ButtonGroup, Card, Classes, H2, H5, Intent, Spinner } from "@blueprintjs/core";
import { IPostJson, UserLevel } from "@sotah-inc/core";
import moment from "moment";

import { IDeletePostOptions } from "../../../actions/posts";
import { LinkButtonRouteContainer } from "../../../route-containers/util/LinkButton";
import { AuthLevel, FetchLevel, UserData } from "../../../types/main";
import { MarkdownRenderer } from "../../util";

export interface IDispatchProps {
  changeIsDeletePostDialogOpen: (v: IDeletePostOptions) => void;
}

export interface IStateProps {
  posts: IPostJson[];
  getPostsLevel: FetchLevel;
  userData: UserData;
}

export interface IRouteProps {
  browseToPost: (post: IPostJson) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IDispatchProps & IStateProps & IOwnProps>;

export class PostList extends React.Component<Props> {
  private static renderSkeletonItem(index: number) {
    return (
      <Card style={{ marginTop: "10px" }} key={index}>
        <H5 className={Classes.SKELETON}>
          <a href="#">Lorem ipsum</a>
        </H5>
        <p className={Classes.SKELETON}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque mollis vitae nunc in
          tincidunt. Cras dapibus posuere ex, eget laoreet ligula ornare nec. Class aptent taciti
          sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus nec
          justo magna. Aenean eleifend sem urna, ut dignissim lectus euismod quis. Proin pretium
          dignissim lacus, eu rhoncus lacus dignissim quis. Praesent nec diam nisl. Donec sit amet
          metus ut ligula tempus pulvinar. Nulla sodales, eros vel consequat aliquet, quam risus
          tempus nulla, rutrum cursus tellus ante eget diam. In iaculis laoreet nisi, sed tincidunt
          nunc facilisis nec. Suspendisse id tellus nec nibh vulputate pharetra. Maecenas auctor
          fringilla ex in ultrices. Cras leo tellus, convallis sed iaculis a, convallis eu nulla.
          Aenean id nibh odio. Ut convallis erat a diam lacinia volutpat. Mauris luctus tincidunt
          tortor eu volutpat.
        </p>
        <Button className={Classes.SKELETON} text="Read More" />
      </Card>
    );
  }

  private static renderReadMoreButton(post: IPostJson) {
    return (
      <>
        <LinkButtonRouteContainer
          destination={`/content/news/${post.slug}`}
          buttonProps={{ icon: "calendar", intent: Intent.PRIMARY, text: "Read More" }}
        />
      </>
    );
  }

  public render(): React.ReactNode {
    return (
      <>
        <div style={{ display: "flex" }}>
          <H2 style={{ margin: 0 }}>Latest News</H2>
          {this.renderLoadingSpinner()}
        </div>
        {this.renderContent()}
      </>
    );
  }

  private renderContent() {
    const { getPostsLevel } = this.props;

    switch (getPostsLevel) {
    case FetchLevel.success:
      return this.renderPosts();
    default:
      return this.renderSkeleton();
    }
  }

  private renderPosts() {
    const { posts } = this.props;

    if (posts.length === 0) {
      return (
        <p>
          <em>Insert news here.</em>
        </p>
      );
    }

    return posts.map((v, i) => this.renderPost(i, v));
  }

  private renderPost(index: number, post: IPostJson) {
    const { browseToPost } = this.props;

    return (
      <Card
        key={index}
        style={{ marginTop: "10px" }}
        interactive={true}
        onClick={() => browseToPost(post)}
      >
        <H5>
          <a
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.stopPropagation();

              browseToPost(post);
            }}
          >
            {post.title}
          </a>
          <small style={{ marginLeft: "5px" }}>
            submitted {moment(new Date(post.createdAt * 1000)).format("MMM Do YYYY")}
          </small>
        </H5>
        <hr />
        <MarkdownRenderer body={post.summary} />
        <hr />
        {this.renderActionButtons(post)}
      </Card>
    );
  }

  private renderActionButtons(post: IPostJson) {
    const { userData, changeIsDeletePostDialogOpen } = this.props;

    if (
      userData.authLevel !== AuthLevel.authenticated ||
      userData.profile.user.level < UserLevel.Admin
    ) {
      return PostList.renderReadMoreButton(post);
    }

    return (
      <ButtonGroup>
        {PostList.renderReadMoreButton(post)}
        <LinkButtonRouteContainer
          destination={`/content/news/${post.slug}/edit`}
          buttonProps={{ icon: "edit" }}
        />
        <Button
          icon="delete"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();

            changeIsDeletePostDialogOpen({ isOpen: true, post });
          }}
        />
      </ButtonGroup>
    );
  }

  private renderLoadingSpinner() {
    const { getPostsLevel } = this.props;

    switch (getPostsLevel) {
    case FetchLevel.success:
      return null;
    case FetchLevel.failure:
      return (
        <div style={{ marginLeft: "10px", paddingTop: "7px" }}>
          <Spinner size={20} intent={Intent.DANGER} value={1} />
        </div>
      );
    case FetchLevel.fetching:
      return (
        <div style={{ marginLeft: "10px", paddingTop: "7px" }}>
          <Spinner size={20} intent={Intent.PRIMARY} />
        </div>
      );
    case FetchLevel.initial:
    default:
      return (
        <div style={{ marginLeft: "10px", paddingTop: "7px" }}>
          <Spinner size={20} intent={Intent.NONE} value={0} />
        </div>
      );
    }
  }

  private renderSkeleton() {
    const numbers: number[] = Array.from({ length: 2 }, (_, i) => i);

    return numbers.map((_, i) => PostList.renderSkeletonItem(i));
  }
}
