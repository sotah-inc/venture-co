import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/PriceLists";
import { PriceListsContainer } from "../../containers/entry-point/PriceLists";
import { extractString, toProfessionPricelist } from "../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, realmEntrypointData, pricelistsEntrypointData }: Props) {
  return (
    <PriceListsContainer
      routeParams={{
        expansion_name: extractString("expansion_name", router.query),
        pricelist_slug: extractString("pricelist_slug", router.query),
        profession_name: extractString("profession_name", router.query),
        realm_slug: extractString("realm_slug", router.query),
        region_name: extractString("region_name", router.query),
      }}
      redirectToPricelist={(region, realm, profession, expansion, pricelist) => {
        const { asDest, url } = toProfessionPricelist(
          region,
          realm,
          expansion,
          profession,
          pricelist,
        );

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
      realmEntrypointData={realmEntrypointData}
      pricelistsEntrypointData={pricelistsEntrypointData}
    />
  );
}

export const PriceListsRouteContainer = withRouter(RouteContainer);
