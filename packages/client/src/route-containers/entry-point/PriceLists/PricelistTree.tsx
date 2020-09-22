import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { PricelistTreeContainer } from "../../../containers/entry-point/PriceLists/PricelistTree";
import { toExpansion, toProfession, toProfessionPricelist } from "../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <PricelistTreeContainer
      browseToExpansion={(region, realm, expansion) => {
        const { url, asDest } = toExpansion(region, realm, expansion);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
      browseToProfession={(region, realm, expansion, profession) => {
        const { url, asDest } = toProfession(region, realm, expansion, profession);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
      browseToProfessionPricelist={(region, realm, expansion, profession, pricelist) => {
        const { url, asDest } = toProfessionPricelist(
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

export const PricelistTreeRouteContainer = withRouter(RouteContainer);
