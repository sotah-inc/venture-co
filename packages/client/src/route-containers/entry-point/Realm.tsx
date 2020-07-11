import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/Realm";
import { RealmContainer } from "../../containers/entry-point/Realm";
import { extractString } from "../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, realmEntrypointData }: Props) {
  return (
    <RealmContainer
      routeParams={{
        realm_slug: extractString("realm_slug", router.query),
        region_name: extractString("region_name", router.query),
      }}
      redirectToRealmAuctions={(region, realm) =>
        router.replace(
          "/data/[region_name]/[realm_slug]/auctions",
          `/data/${region.config_region.name}/${realm.realm.slug}/auctions`,
        )
      }
      realmEntrypointData={realmEntrypointData}
    />
  );
}

export const RealmRouteContainer = withRouter(RouteContainer);
