import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { DeletePostDialogContainer } from "../../../containers/App/Content/DeletePostDialog";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ history }: Props) {
  return <DeletePostDialogContainer browseToNews={() => history.replace("/content/news")} />;
}

export const DeletePostDialogRouteContainer = withRouter(RouteContainer);
