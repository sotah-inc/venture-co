import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IRouteProps } from "../../../components/App/Content/Post";
import { PostContainer } from "../../../containers/App/Content/Post";

type Props = Readonly<IRouteProps & WithRouterProps>;

function RouteContainer({ history, match: { params } }: Props) {
  return (
    <PostContainer
      browseToPostEdit={post => router.push(`/content/news/${post.slug}/edit`)}
      browseToHome={() => router.push("")}
      browseToNews={() => router.push("/content/news")}
      routeParams={params}
    />
  );
}

export const NewsRouteContainer = withRouter(RouteContainer);
