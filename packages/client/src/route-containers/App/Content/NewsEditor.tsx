import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IRouteProps } from "../../../components/App/Content/NewsEditor";
import { NewsEditorContainer } from "../../../containers/App/Content/NewsEditor";

type Props = Readonly<IRouteProps & WithRouterProps>;

function RouteContainer({ history, match: { params } }: Props) {
  return (
    <NewsEditorContainer
      browseToPost={post => router.push(`/content/news/${post.slug}`)}
      browseToHome={() => router.push("")}
      browseToNews={() => router.push("/content/news")}
      routeParams={params}
    />
  );
}

export const NewsRouteContainer = withRouter(RouteContainer);
