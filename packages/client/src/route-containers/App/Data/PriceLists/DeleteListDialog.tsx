import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

// tslint:disable-next-line:max-line-length
import { DeleteListDialogContainer } from "../../../../containers/App/Data/PriceLists/DeleteListDialog";

type Props = Readonly<WithRouterProps>;

function RouteContainer(props: Props) {
  const { history } = props;

  return (
    <DeleteListDialogContainer
      browseOnDeletion={(region, realm, profession, expansion, list) => {
        const urlParts = [
          "data",
          region.name,
          realm.slug,
          "professions",
          profession.name,
          expansion.name,
        ];
        if (list !== null && list.slug !== null) {
          urlParts.push(list.slug);
        }
        router.replace(`/${urlParts.join("/")}`);
      }}
    />
  );
}

export const DeleteListDialogRouteContainer = withRouter(RouteContainer);
