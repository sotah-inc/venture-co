import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { PostListContainer } from "../../../containers/App/Content/PostList";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ history }: Props) {
  return (
    <PostListContainer
      browseToPost={post => history.push(`/content/news/${post.slug}`)}
      browseToPostEdit={post => history.push(`/content/news/${post.slug}/edit`)}
    />
  );
}

export const PostListRouteContainer = withRouter(RouteContainer);
