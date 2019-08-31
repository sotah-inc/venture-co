import * as React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IRouteProps } from "../../components/App/AuctionsLanding";
import { AuctionsLandingContainer } from "../../containers/App/AuctionsLanding";
import { extractString } from "../../util";

type Props = Readonly<IRouteProps & WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <AuctionsLandingContainer
      routeParams={{ region_name: extractString("region_name", router.query) }}
      redirectToAuctions={(region, realm) =>
        router.replace(`/data/${region.name}/${realm.slug}/auctions`)
      }
    />
  );
}

export const AuctionsLandingRouteContainer = withRouter(RouteContainer);
