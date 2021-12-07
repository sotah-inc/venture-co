import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { CreateListDialogContainer } from "../../../containers/entry-point/PriceLists/CreateListDialog";
import { toProfessionPricelist, toUserPricelist } from "../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <CreateListDialogContainer
      browseOnCreate={(gameVersion, region, realm, pricelist, professionData) => {
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

export const CreateListDialogRouteContainer = withRouter(RouteContainer);
