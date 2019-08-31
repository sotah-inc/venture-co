import * as React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IRouteProps } from "../../components/App/AuctionsLanding";
import { AuctionsLandingContainer } from "../../containers/App/AuctionsLanding";

type Props = Readonly<IRouteProps & WithRouterProps>;

function RouteContainer({ match: { params }, history }: Props) {
  return (
    <AuctionsLandingContainer
      routeParams={params}
      redirectToAuctions={(region, realm) =>
        router.replace(`/data/${region.name}/${realm.slug}/auctions`)
      }
    />
  );
}

export const AuctionsLandingRouteContainer = withRouter(RouteContainer);
