import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IOwnProps } from "../../components/entry-point/PriceLists";
import { PriceListsContainer } from "../../containers/entry-point/PriceLists";
import { extractString } from "../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, loadId }: Props) {
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
        const urlParts = [
          "data",
          region.name,
          realm.slug,
          "professions",
          profession.name,
          expansion.name,
          pricelist.slug,
        ];
        (async () =>
          router.replace(
            // tslint:disable-next-line:max-line-length
            "/data/[region_name]/[realm_slug]/professions/[profession_name]/[expansion_name]/[pricelist_slug]",
            `/${urlParts.join("/")}`,
          ))();
      }}
      browseOnRealmChange={(region, realm, profession, expansion, pricelist) => {
        const urlParts = ["data", region.name, realm.slug, "professions"];
        if (profession === null) {
          if (pricelist !== null && pricelist.slug !== null) {
            urlParts.push(...["user", pricelist.slug]);
          }
        } else {
          urlParts.push(profession.name);

          if (expansion !== null) {
            urlParts.push(expansion.name);
          }
          if (pricelist !== null && pricelist.slug !== null) {
            urlParts.push(pricelist.slug);
          }
        }
        (async () => router.replace(`/${urlParts.join("/")}`))();

        return;
      }}
      loadId={loadId}
    />
  );
}

export const PriceListsRouteContainer = withRouter(RouteContainer);
