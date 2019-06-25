import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../components/App/Topbar";
import { TopbarContainer } from "../../containers/App/Topbar";

export const TopbarRouteContainer = withRouter<IOwnProps>(TopbarContainer);
