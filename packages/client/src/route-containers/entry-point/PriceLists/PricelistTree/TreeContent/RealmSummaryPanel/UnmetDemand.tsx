import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import {
  UnmetDemandContainer,
  // eslint-disable-next-line max-len
} from "../../../../../../containers/entry-point/PriceLists/PricelistTree/TreeContent/RealmSummaryPanel/UnmetDemand";
import { toProfessionPricelist } from "../../../../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <UnmetDemandContainer
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
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
      browseToProfession={(gameVersion, region, realm, expansion, profession) => {
        const { url, asDest } = toProfessionPricelist(
          gameVersion,
          region,
          realm,
          expansion,
          profession,
          null,
        );

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const UnmetDemandRouteContainer = withRouter(RouteContainer);
