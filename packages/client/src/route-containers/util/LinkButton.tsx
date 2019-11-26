import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps, LinkButton } from "../../components/util/LinkButton";

type Props = Readonly<IOwnProps & WithRouterProps>;

function RouteContainer({ buttonProps, destination, router, prefix }: Props) {
  return (
    <LinkButton
      locationPathname={router.asPath}
      historyPush={(pushDestination: string) => router.replace(pushDestination)}
      destination={destination}
      buttonProps={buttonProps}
      prefix={prefix}
    />
  );
}

export const LinkButtonRouteContainer = withRouter(RouteContainer);
