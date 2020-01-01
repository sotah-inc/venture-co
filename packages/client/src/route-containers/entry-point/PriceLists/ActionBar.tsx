import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { ActionBarContainer } from "../../../containers/entry-point/PriceLists/ActionBar";
import { toExpansion, toProfession, toProfessionPricelist } from "../../../util/routes";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <ActionBarContainer
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

export const ActionBarRouteContainer = withRouter(RouteContainer);
