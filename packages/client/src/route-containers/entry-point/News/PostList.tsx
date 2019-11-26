import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { PostListContainer } from "../../../containers/entry-point/News/PostList";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <PostListContainer
      browseToPost={post =>
        router.replace("/content/news/[post_slug]", `/content/news/${post.slug}`)
      }
    />
  );
}

export const PostListRouteContainer = withRouter(RouteContainer);
