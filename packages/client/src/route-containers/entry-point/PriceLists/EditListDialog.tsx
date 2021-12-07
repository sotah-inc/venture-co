import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { EditListDialogContainer } from "../../../containers/entry-point/PriceLists/EditListDialog";
import { toProfessionPricelist, toUserPricelist } from "../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <EditListDialogContainer
      browseOnUpdate={(gameVersion, region, realm, pricelist, professionData) => {
        const { asDest, url } = (() => {
          if (professionData) {
            return toProfessionPricelist(
              gameVersion,
              region,
              realm,
              professionData.expansion,
              professionData.profession,
              pricelist,
            );
          }

          return toUserPricelist(region, realm, pricelist);
        })();

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const EditListDialogRouteContainer = withRouter(RouteContainer);
