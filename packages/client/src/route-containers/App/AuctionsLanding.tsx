import * as React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { IRouteParams } from "../../components/App/AuctionsLanding";
import { AuctionsLandingContainer } from "../../containers/App/AuctionsLanding";

type Props = Readonly<RouteComponentProps<IRouteParams>>;

function RouteContainer({ match: { params }, history }: Props) {
  return (
    <AuctionsLandingContainer
      routeParams={params}
      redirectToAuctions={(region, realm) =>
        history.replace(`/data/${region.name}/${realm.slug}/auctions`)
      }
    />
  );
}

export const AuctionsLandingRouteContainer = withRouter(RouteContainer);
