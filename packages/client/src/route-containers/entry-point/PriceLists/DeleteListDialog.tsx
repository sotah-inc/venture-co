import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { DeleteListDialogContainer } from "../../../containers/entry-point/PriceLists/DeleteListDialog";
import { toProfessionPricelist, toUserPricelist } from "../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <DeleteListDialogContainer
      browseOnDeletion={(gameVersion, region, realm, list, professionData) => {
        const { asDest, url } = (() => {
          if (professionData) {
            if (!list) {
              return toProfessionPricelist(
                gameVersion,
                region,
                realm,
                professionData.expansion,
                professionData.profession,
                null,
              );
            }

            return toProfessionPricelist(
              gameVersion,
              region,
              realm,
              professionData.expansion,
              professionData.profession,
              list,
            );
          }

          if (!list) {
            return toProfessionPricelist(gameVersion, region, realm, null, null, null);
          }

          return toUserPricelist(region, realm, list);
        })();

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const DeleteListDialogRouteContainer = withRouter(RouteContainer);
