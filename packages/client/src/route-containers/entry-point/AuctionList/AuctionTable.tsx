import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { AuctionTableContainer } from "../../../containers/entry-point/AuctionList/AuctionTable";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <AuctionTableContainer
      browseToProfessionPricelist={(region, realm, profession, expansion, pricelist) => {
        const professionPricelistUrl = [
          "data",
          region.name,
          realm.slug,
          "professions",
          profession.name,
          expansion.name,
          pricelist.slug,
        ].join("/");
        (async () =>
          router.replace(
            // tslint:disable-next-line:max-line-length
            "/data/[region_name]/[realm_slug]/professions/[profession_name]/[expansion_name]/[pricelist_slug]",
            `/${professionPricelistUrl}`,
          ))();
      }}
    />
  );
}

export const AuctionTableRouteContainer = withRouter(RouteContainer);
