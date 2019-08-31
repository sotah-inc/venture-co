import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

// tslint:disable-next-line:max-line-length
import { CreateListDialogContainer } from "../../../../containers/App/Data/PriceLists/CreateListDialog";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <CreateListDialogContainer
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
        router.replace(`/${professionPricelistUrl}`);
      }}
    />
  );
}

export const CreateListDialogRouteContainer = withRouter(RouteContainer);
