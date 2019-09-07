import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IRouteProps } from "../../../components/App/Data/Realm";
import { RealmContainer } from "../../../containers/App/Data/Realm";
import { extractString } from "../../../util";

type Props = Readonly<IRouteProps & WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <RealmContainer
      routeParams={{
        realm_slug: extractString("realm_slug", router.query),
        region_name: extractString("region_name", router.query),
      }}
      redirectToRealmAuctions={(region, realm) =>
        router.replace(`/data/${region.name}/${realm.slug}/auctions`)
      }
    />
  );
}

export const RealmRouteContainer = withRouter(RouteContainer);
