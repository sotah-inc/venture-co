import * as React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { IRouteParams } from "../../../components/App/Data/AuctionList";
import { AuctionsListContainer } from "../../../containers/App/Data/AuctionList";

type Props = Readonly<RouteComponentProps<IRouteParams>>;

function RouteContainer({ match: { params }, history }: Props) {
  return (
    <AuctionsListContainer
      routeParams={params}
      browseToRealmAuctions={(region, realm) =>
        history.push(`/data/${region.name}/${realm.slug}/auctions`)
      }
    />
  );
}

export const AuctionListRouteContainer = withRouter(RouteContainer);
