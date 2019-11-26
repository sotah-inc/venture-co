import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/Post";
import { PostContainer } from "../../containers/entry-point/Post";
import { extractString } from "../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, postPayload }: Props) {
  return (
    <PostContainer
      browseToPostEdit={post => router.replace(`/content/news/${post.slug}/edit`)}
      browseToHome={() => router.replace("")}
      browseToNews={() => router.replace("/content/news")}
      routeParams={{ post_slug: extractString("post_slug", router.query) }}
      postPayload={postPayload}
    />
  );
}

export const PostRouteContainer = withRouter(RouteContainer);
