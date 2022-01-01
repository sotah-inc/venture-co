import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { PricelistTreeContainer } from "../../../containers/entry-point/PriceLists/PricelistTree";
import { toProfessionPricelist } from "../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <PricelistTreeContainer
      browseToExpansion={(gameVersion, region, realm, expansion) => {
        const { url, asDest } = toProfessionPricelist(
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
      browseToProfessionPricelist={(
        gameVersion,
        region,
        realm,
        expansion,
        profession,
        pricelist,
      ) => {
        const { url, asDest } = toProfessionPricelist(
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
    />
  );
}

export const PricelistTreeRouteContainer = withRouter(RouteContainer);
