import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import {
  IOwnProps,
} from "../../../../components/entry-point/AuctionList/AuctionTable/RelatedProfessionPricelists";
import {
  RelatedProfessionPricelistsContainer,
} from "../../../../containers/entry-point/AuctionList/AuctionTable/RelatedProfessionPricelists";
import {
  toExpansionProfessionPricelists,
  toProfessionPricelist,
  toProfessionPricelistsProfession,
} from "../../../../util";

type Props = Readonly<WithRouterProps & IOwnProps>;

function RouteContainer({ router, professionPricelists }: Props) {
  return (
    <RelatedProfessionPricelistsContainer
      professionPricelists={professionPricelists}
      browseToExpansion={(region, realm, expansion) => {
        const { url, asDest } = toExpansionProfessionPricelists(region, realm, expansion);

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
      browseToProfession={(region, realm, expansion, profession) => {
        const { url, asDest } = toProfessionPricelistsProfession(
          region,
          realm,
          expansion,
          profession,
        );

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
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

export const RelatedProfessionPricelistsRouteContainer = withRouter(RouteContainer);
