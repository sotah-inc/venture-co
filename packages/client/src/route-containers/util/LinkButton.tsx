import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { IOwnProps, LinkButton } from "../../components/util/LinkButton";

type Props = Readonly<RouteComponentProps<{}> & IOwnProps>;

function RouteContainer(props: Props) {
  // props
  const { buttonProps, destination, history, location } = props;

  return (
    <LinkButton
      locationPathname={location.pathname}
      historyPush={(pushDestination: string) => {
        history.push(pushDestination);
      }}
      destination={destination}
      buttonProps={buttonProps}
    />
  );
}

export const LinkButtonRouteContainer = withRouter(RouteContainer);
