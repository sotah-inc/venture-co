import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/PriceLists";
import { PriceListsContainer } from "../../containers/entry-point/PriceLists";
import { toProfessionPricelist } from "../../util";
import { extractSlug } from "../../util/extract-slug";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, realmEntrypointData, pricelistsEntrypointData }: Props) {
  const [
    nextGameVersion,
    nextRegionName,
    nextRealmSlug,
    expansionName,
    professionSlug,
    pricelistSlug,
  ] = extractSlug("slug", router.query);

  return (
    <PriceListsContainer
      routeParams={{
        expansion_name: expansionName,
        pricelist_slug: pricelistSlug,
        profession_slug: professionSlug,
        realm_slug: nextRealmSlug,
        region_name: nextRegionName,
        game_version: nextGameVersion,
      }}
      redirectToExpansion={(gameVersion, region, realm, expansion) => {
        const { asDest, url } = toProfessionPricelist(
          gameVersion,
          region,
          realm,
          expansion,
          null,
          null,
        );

        (async () => {
          await router.replace(url, asDest);
        })();
      }}
      redirectToProfession={(gameVersion, region, realm, expansion, profession) => {
        const { asDest, url } = toProfessionPricelist(
          gameVersion,
          region,
          realm,
          expansion,
          profession,
          null,
        );

        (async () => {
          await router.replace(url, asDest);
        })();
      }}
      redirectToPricelist={(gameVersion, region, realm, expansion, profession, pricelist) => {
        const { asDest, url } = toProfessionPricelist(
          gameVersion,
          region,
          realm,
          expansion,
          profession,
          pricelist,
        );

        (async () => {
          await router.replace(url, asDest);
        })();
      }}
      realmEntrypointData={realmEntrypointData}
      pricelistsEntrypointData={pricelistsEntrypointData}
    />
  );
}

export const PriceListsRouteContainer = withRouter(RouteContainer);
