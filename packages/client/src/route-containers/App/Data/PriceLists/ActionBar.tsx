import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { ActionBarContainer } from "../../../../containers/App/Data/PriceLists/ActionBar";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ history }: Props) {
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
        history.push(`/${urlParts.join("/")}`);
      }}
    />
  );
}

export const ActionBarRouteContainer = withRouter(RouteContainer);
