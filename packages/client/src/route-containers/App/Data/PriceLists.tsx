import * as React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { IRouteProps } from "../../../components/App/Data/PriceLists";
import { PriceListsContainer } from "../../../containers/App/Data/PriceLists";

type Props = Readonly<IRouteProps & WithRouterProps>;

function RouteContainer({ match: { params }, history }: Props) {
  return (
    <PriceListsContainer
      routeParams={params}
      redirectToPricelist={(region, realm, profession, expansion, pricelist) => {
        const url = [
          "data",
          region.name,
          realm.slug,
          "professions",
          profession.name,
          expansion.name,
          pricelist.slug,
        ].join("/");
        router.replace(`/${url}`);
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
        router.push(`/${urlParts.join("/")}`);

        return;
      }}
    />
  );
}

export const PriceListsRouteContainer = withRouter(RouteContainer);
