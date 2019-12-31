import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { ActionBarContainer } from "../../../containers/entry-point/PriceLists/ActionBar";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <ActionBarContainer
      browseOnChange={(region, realm, profession, expansion, list) => {
        const urlParts: Array<[string, string]> = [
          ["data", "data"],
          ["[region_name]", region.name],
          ["[realm_slug]", realm.slug],
          ["professions", "professions"],
        ];
        if (profession === null) {
          if (list !== null && list.slug !== null) {
            urlParts.push(["user", list.slug]);
          }
        } else {
          urlParts.push(["[profession_name]", profession.name]);

          if (expansion !== null) {
            urlParts.push(["[expansion_name]", expansion.name]);
          }
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

export const ActionBarRouteContainer = withRouter(RouteContainer);
