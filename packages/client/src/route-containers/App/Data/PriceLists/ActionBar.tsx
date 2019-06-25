import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../../components/App/Data/PriceLists/ActionBar";
import { ActionBarContainer } from "../../../../containers/App/Data/PriceLists/ActionBar";

export const ActionBarRouteContainer = withRouter<IOwnProps>(ActionBarContainer);
