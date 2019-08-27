import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { NewsCreatorContainer } from "../../../containers/App/Content/NewsCreator";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ history }: Props) {
  return (
    <NewsCreatorContainer
      browseToPost={post => history.push(`/content/news/${post.slug}`)}
      browseToHome={() => history.push("")}
      browseToNews={() => history.push("/content/news")}
    />
  );
}

export const NewsRouteContainer = withRouter(RouteContainer);
