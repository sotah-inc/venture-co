import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { AuctionTableContainer } from "../../../../containers/App/Data/AuctionList/AuctionTable";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ history }: Props) {
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
        router.push(`/${professionPricelistUrl}`);
      }}
    />
  );
}

export const AuctionTableRouteContainer = withRouter(RouteContainer);
