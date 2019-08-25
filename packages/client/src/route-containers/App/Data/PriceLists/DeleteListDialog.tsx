import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

// tslint:disable-next-line:max-line-length
import { DeleteListDialogContainer } from "../../../../containers/App/Data/PriceLists/DeleteListDialog";

type Props = Readonly<RouteComponentProps<{}>>;

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
        history.replace(`/${urlParts.join("/")}`);
      }}
    />
  );
}

export const DeleteListDialogRouteContainer = withRouter(RouteContainer);
