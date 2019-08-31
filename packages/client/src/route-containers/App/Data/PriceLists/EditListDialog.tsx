import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import React from "react";

import { EditListDialogContainer } from "../../../../containers/App/Data/PriceLists/EditListDialog";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <EditListDialogContainer
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
        (async () => router.replace(`/${professionPricelistUrl}`))();
      }}
    />
  );
}

export const EditListDialogRouteContainer = withRouter(RouteContainer);
