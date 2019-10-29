import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { PostContainer } from "../../../containers/entry-point/Content/Post";
import { extractString } from "../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <PostContainer
      browseToPostEdit={post => router.push(`/content/news/${post.slug}/edit`)}
      browseToHome={() => router.push("")}
      browseToNews={() => router.push("/content/news")}
      routeParams={{ post_slug: extractString("post_slug", router.query) }}
    />
  );
}

export const PostRouteContainer = withRouter(RouteContainer);
