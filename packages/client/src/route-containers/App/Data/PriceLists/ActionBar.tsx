import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { ActionBarContainer } from "../../../../containers/App/Data/PriceLists/ActionBar";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <ActionBarContainer
      browseOnRealmChange={(region, realm, profession, expansion, list) => {
        const urlParts = ["data", region.name, realm.slug, "professions"];
        if (profession === null) {
          if (list !== null && list.slug !== null) {
            urlParts.push(...["user", list.slug]);
          }
        } else {
          urlParts.push(profession.name);

          if (expansion !== null) {
            urlParts.push(expansion.name);
          }
          if (list !== null && list.slug !== null) {
            urlParts.push(list.slug);
          }
        }
        (async () => router.push(`/${urlParts.join("/")}`))();
      }}
    />
  );
}

export const ActionBarRouteContainer = withRouter(RouteContainer);
