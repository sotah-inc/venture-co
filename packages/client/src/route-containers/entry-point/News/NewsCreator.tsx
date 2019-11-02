import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { NewsCreatorContainer } from "../../../containers/entry-point/News/NewsCreator";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <NewsCreatorContainer
      browseToPost={post => router.push(`/content/news/${post.slug}`)}
      browseToHome={() => router.push("")}
      browseToNews={() => router.push("/content/news")}
    />
  );
}

export const NewsCreatorRouteContainer = withRouter(RouteContainer);
