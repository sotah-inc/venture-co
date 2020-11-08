import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

// tslint:disable-next-line:max-line-length
import { DeleteListDialogContainer } from "../../../containers/entry-point/PriceLists/DeleteListDialog";
import {
  toProfessionPricelist,
  toProfessionPricelistsProfession,
  toRealmProfessionPricelists,
  toUserPricelist,
} from "../../../util";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <DeleteListDialogContainer
      browseOnDeletion={(region, realm, list, professionData) => {
        const { asDest, url } = (() => {
          if (professionData) {
            if (!list) {
              return toProfessionPricelistsProfession(
                region,
                realm,
                professionData.expansion,
                professionData.profession,
              );
            }

            return toProfessionPricelist(
              region,
              realm,
              professionData.expansion,
              professionData.profession,
              list,
            );
          }

          if (!list) {
            return toRealmProfessionPricelists(region, realm);
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
