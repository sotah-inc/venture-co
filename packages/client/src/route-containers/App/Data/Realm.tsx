import * as React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { IRouteParams } from "../../../components/App/Data/Realm";
import { RealmContainer } from "../../../containers/App/Data/Realm";

type Props = Readonly<RouteComponentProps<IRouteParams>>;

function RouteContainer({ match: { params }, history }: Props) {
  return (
    <RealmContainer
      routeParams={params}
      redirectToRealmAuctions={(region, realm) =>
        history.replace(`/data/${region.name}/${realm.slug}/auctions`)
      }
    />
  );
}

export const RealmRouteContainer = withRouter(RouteContainer);
