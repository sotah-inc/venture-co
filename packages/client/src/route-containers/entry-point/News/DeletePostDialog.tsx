import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

// tslint:disable-next-line:max-line-length
import { DeletePostDialogContainer } from "../../../containers/entry-point/News/DeletePostDialog";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return <DeletePostDialogContainer browseToNews={() => router.replace("/content/news")} />;
}

export const DeletePostDialogRouteContainer = withRouter(RouteContainer);
