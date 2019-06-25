import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../components/App/Topbar/NewsButton";
import { NewsButtonContainer } from "../../../containers/App/Topbar/NewsButton";

export const NewsButtonRouteContainer = withRouter<IOwnProps>(NewsButtonContainer);
