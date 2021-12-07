import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import {
  IOwnProps,
} from "../../../../components/entry-point/AuctionList/AuctionTable/RelatedProfessionPricelists";
import {
  RelatedProfessionPricelistsContainer,
} from "../../../../containers/entry-point/AuctionList/AuctionTable/RelatedProfessionPricelists";
import { toProfessionPricelist } from "../../../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, professionPricelists }: Props) {
  return (
    <RelatedProfessionPricelistsContainer
      professionPricelists={professionPricelists}
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
      browseToProfessionPricelist={(
        gameVersion,
        region,
        realm,
        expansion,
        profession,
        pricelist,
      ) => {
        const { asDest, url } = toProfessionPricelist(
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
    />
  );
}

export const RelatedProfessionPricelistsRouteContainer = withRouter(RouteContainer);
