import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

// tslint:disable-next-line:max-line-length
import { DeleteListDialogContainer } from "../../../containers/entry-point/PriceLists/DeleteListDialog";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <DeleteListDialogContainer
      browseOnDeletion={(region, realm, list, professionData) => {
        const urlParts: Array<[string, string]> = [
          ["data", "data"],
          ["[region_name]", region.config_region.name],
          ["[realm_slug]", realm.realm.slug],
          ["professions", "professions"],
        ];

        if (typeof professionData === "undefined") {
          if (list !== null && list.slug !== null) {
            urlParts.push(["user", "user"]);
            urlParts.push(["[pricelist_slug]", list.slug]);
          }
        } else {
          urlParts.push(
            ["[profession_name]", professionData.profession.name],
            ["[expansion_name]", professionData.expansion.name],
          );

          if (list !== null && list.slug !== null) {
            urlParts.push(["[pricelist_slug]", list.slug]);
          }
        }

        const dest = urlParts.map(v => v[0]).join("/");
        const asDest = urlParts.map(v => v[1]).join("/");

        (async () => {
          await router.replace(`/${dest}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const DeleteListDialogRouteContainer = withRouter(RouteContainer);
