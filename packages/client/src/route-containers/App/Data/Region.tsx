import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../components/App/Data/Region";
import { RegionContainer } from "../../../containers/App/Data/Region";

export const RegionRouteContainer = withRouter<IOwnProps>(RegionContainer);
