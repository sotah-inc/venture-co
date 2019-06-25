import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../components/App/Data/PriceLists";
import { PriceListsContainer } from "../../../containers/App/Data/PriceLists";

export const PriceListsRouteContainer = withRouter<IOwnProps>(PriceListsContainer);
