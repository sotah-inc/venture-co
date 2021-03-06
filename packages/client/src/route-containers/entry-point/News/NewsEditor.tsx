import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IRouteProps } from "../../../components/entry-point/News/NewsEditor";
import { NewsEditorContainer } from "../../../containers/entry-point/News/NewsEditor";
import { extractString } from "../../../util";

type Props = Readonly<IRouteProps & WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <NewsEditorContainer
      browseToPost={post =>
        router.replace("/content/news/[post_slug]", `/content/news/${post.slug}`)
      }
      browseToHome={() => router.replace("")}
      browseToNews={() => router.replace("/content/news")}
      routeParams={{ post_slug: extractString("post_slug", router.query) }}
    />
  );
}

export const NewsEditorRouteContainer = withRouter(RouteContainer);
