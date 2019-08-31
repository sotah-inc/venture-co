import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { PostListContainer } from "../../../containers/App/Content/PostList";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <PostListContainer
      browseToPost={post => router.push(`/content/news/${post.slug}`)}
      browseToPostEdit={post => router.push(`/content/news/${post.slug}/edit`)}
    />
  );
}

export const PostListRouteContainer = withRouter(RouteContainer);
