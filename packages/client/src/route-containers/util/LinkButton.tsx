import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps, LinkButton } from "../../components/util/LinkButton";

type Props = Readonly<IOwnProps & WithRouterProps>;

function RouteContainer(props: Props) {
  // props
  const { buttonProps, destination, router } = props;

  return (
    <LinkButton
      locationPathname={router.pathname}
      historyPush={(pushDestination: string) => router.push(pushDestination)}
      destination={destination}
      buttonProps={buttonProps}
    />
  );
}

export const LinkButtonRouteContainer = withRouter(RouteContainer);
