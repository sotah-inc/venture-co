import * as React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IRouteProps } from "../../../components/App/Data/AuctionList";
import { AuctionsListContainer } from "../../../containers/App/Data/AuctionList";

type Props = Readonly<IRouteProps & WithRouterProps>;

function RouteContainer({ match: { params }, history }: Props) {
  return (
    <AuctionsListContainer
      routeParams={params}
      browseToRealmAuctions={(region, realm) =>
        router.push(`/data/${region.name}/${realm.slug}/auctions`)
      }
    />
  );
}

export const AuctionListRouteContainer = withRouter(RouteContainer);
