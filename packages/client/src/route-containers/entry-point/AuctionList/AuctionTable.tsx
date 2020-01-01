import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { AuctionTableContainer } from "../../../containers/entry-point/AuctionList/AuctionTable";
import { toProfessionPricelist } from "../../../util/routes";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <AuctionTableContainer
      browseToProfessionPricelist={(region, realm, expansion, profession, pricelist) => {
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
    />
  );
}

export const AuctionTableRouteContainer = withRouter(RouteContainer);
