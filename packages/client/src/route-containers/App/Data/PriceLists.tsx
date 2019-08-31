import * as React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IRouteProps } from "../../../components/App/Data/PriceLists";
import { PriceListsContainer } from "../../../containers/App/Data/PriceLists";
import { extractString } from "../../../util";

type Props = Readonly<IRouteProps & WithRouterProps>;

function RouteContainer({ router }: Props) {
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
        (async () => router.replace(`/${urlParts.join("/")}`))();
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
        (async () => router.push(`/${urlParts.join("/")}`))();

        return;
      }}
    />
  );
}

export const PriceListsRouteContainer = withRouter(RouteContainer);
