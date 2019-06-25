import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../../components/App/Data/PriceLists/PricelistTree";
import { PricelistTreeContainer } from "../../../../containers/App/Data/PriceLists/PricelistTree";

export const PricelistTreeRouteContainer = withRouter<IOwnProps>(PricelistTreeContainer);
