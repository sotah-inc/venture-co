import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { IRouteParams } from "../../../components/App/Content/NewsEditor";
import { NewsEditorContainer } from "../../../containers/App/Content/NewsEditor";

type Props = Readonly<RouteComponentProps<IRouteParams>>;

function RouteContainer({ history, match: { params } }: Props) {
  return (
    <NewsEditorContainer
      browseToPost={post => history.push(`/content/news/${post.slug}`)}
      browseToHome={() => history.push("")}
      browseToNews={() => history.push("/content/news")}
      routeParams={params}
    />
  );
}

export const NewsRouteContainer = withRouter(RouteContainer);
