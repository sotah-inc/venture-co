import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/PriceLists";
import { PriceListsContainer } from "../../containers/entry-point/PriceLists";
import { toProfessionPricelist } from "../../util";
import { extractSlug } from "../../util/extract-slug";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, realmEntrypointData, pricelistsEntrypointData }: Props) {
  const [nextRegionName, nextRealmSlug, expansionName, professionName, pricelistSlug] = extractSlug(
    "slug",
    router.query,
  );

  return (
    <PriceListsContainer
      routeParams={{
        expansion_name: expansionName,
        pricelist_slug: pricelistSlug,
        profession_name: professionName,
        realm_slug: nextRealmSlug,
        region_name: nextRegionName,
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
