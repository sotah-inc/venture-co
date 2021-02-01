import React from "react";

import { IRegionComposite } from "@sotah-inc/core";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/BaseEntrypoint";
import { BaseEntrypointContainer } from "../../containers/entry-point/BaseEntrypoint";
import { resolveWrapper } from "../../util";

type Props = Readonly<
  WithRouterProps &
    IOwnProps & {
      resolvePath: (region: IRegionComposite) => { url: string; as: string };
    }
>;

function RouteContainer({ router, label, resolvePath }: Props) {
  return (
    <BaseEntrypointContainer redirectToRegion={resolveWrapper(resolvePath, router)} label={label} />
  );
}

export const BaseEntrypointRouteContainer = withRouter(RouteContainer);
