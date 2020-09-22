import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { UnmetDemandContainer } from "../../../../../../containers/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel/UnmetDemand";
import { toProfession, toProfessionPricelist } from "../../../../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <UnmetDemandContainer
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
      browseToProfession={(region, realm, expansion, profession) => {
        const { url, asDest } = toProfession(region, realm, expansion, profession);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const UnmetDemandRouteContainer = withRouter(RouteContainer);
