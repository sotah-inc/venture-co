import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { EditListDialogContainer } from "../../../../containers/App/Data/PriceLists/EditListDialog";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer(props: Props) {
  const { history } = props;

  return (
    <EditListDialogContainer
      browseToProfessionPricelist={(region, realm, profession, expansion, pricelist) => {
        const professionPricelistUrl = [
          "data",
          region.name,
          realm.slug,
          "professions",
          profession.name,
          expansion.name,
          pricelist.slug,
        ].join("/");
        history.replace(`/${professionPricelistUrl}`);
      }}
    />
  );
}

export const EditListDialogRouteContainer = withRouter(RouteContainer);
