import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

// tslint:disable-next-line:max-line-length
import { CreateListDialogContainer } from "../../../containers/entry-point/PriceLists/CreateListDialog";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <CreateListDialogContainer
      browseOnCreate={(region, realm, pricelist, professionData) => {
        const urlParts: Array<[string, string]> = [
          ["data", "data"],
          ["[region_name]", region.config_region.name],
          ["[realm_slug]", realm.slug],
          ["professions", "professions"],
        ];

        if (pricelist.slug !== null) {
          if (typeof professionData === "undefined") {
            urlParts.push(["user", "user"]);
          } else {
            urlParts.push(
              ["[profession_name]", professionData.profession.name],
              ["[expansion_name]", professionData.expansion.name],
            );
          }

          urlParts.push(["[pricelist_slug]", pricelist.slug]);
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

export const CreateListDialogRouteContainer = withRouter(RouteContainer);
