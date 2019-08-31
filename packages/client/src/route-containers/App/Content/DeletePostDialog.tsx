import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { DeletePostDialogContainer } from "../../../containers/App/Content/DeletePostDialog";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <DeletePostDialogContainer browseToNews={() => router.replace("/content/news")} />;
}

export const DeletePostDialogRouteContainer = withRouter(RouteContainer);
