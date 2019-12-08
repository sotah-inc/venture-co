import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

// tslint:disable-next-line:max-line-length
import { CreateListDialogContainer } from "../../../containers/entry-point/PriceLists/CreateListDialog";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <CreateListDialogContainer
      browseToProfessionPricelist={(region, realm, profession, expansion, pricelist) => {
        const urlParts: Array<[string, string]> = [
          ["data", "data"],
          ["[region_name]", region.name],
          ["[realm_slug]", realm.slug],
          ["professions", "professions"],
          ["[profession_name]", profession.name],
          ["[expansion_name]", expansion.name],
          ["[pricelist_slug]", pricelist.slug === null ? "" : pricelist.slug],
        ];

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
