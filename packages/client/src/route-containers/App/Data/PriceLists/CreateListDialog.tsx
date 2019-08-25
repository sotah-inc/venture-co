import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

// tslint:disable-next-line:max-line-length
import { CreateListDialogContainer } from "../../../../containers/App/Data/PriceLists/CreateListDialog";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer(props: Props) {
  const { history } = props;

  return (
    <CreateListDialogContainer
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

export const CreateListDialogRouteContainer = withRouter(RouteContainer);
