import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { AuctionsListContainer } from "../../containers/entry-point/AuctionList";
import { extractString } from "../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <AuctionsListContainer
      routeParams={{
        realm_slug: extractString("realm_slug", router.query),
        region_name: extractString("region_name", router.query),
      }}
      browseToRealmAuctions={(region, realm) =>
        router.push(`/data/${region.name}/${realm.slug}/auctions`)
      }
    />
  );
}

export const AuctionListRouteContainer = withRouter(RouteContainer);
