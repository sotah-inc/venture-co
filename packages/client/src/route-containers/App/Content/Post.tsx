import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { IRouteParams } from "../../../components/App/Content/Post";
import { PostContainer } from "../../../containers/App/Content/Post";

type Props = Readonly<RouteComponentProps<IRouteParams>>;

function RouteContainer({ history, match: { params } }: Props) {
  return (
    <PostContainer
      browseToPostEdit={post => history.push(`/content/news/${post.slug}/edit`)}
      browseToHome={() => history.push("")}
      browseToNews={() => history.push("/content/news")}
      routeParams={params}
    />
  );
}

export const NewsRouteContainer = withRouter(RouteContainer);
