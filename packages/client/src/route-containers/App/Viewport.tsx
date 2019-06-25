import { withRouter } from "react-router-dom";

import { IOwnProps, Viewport } from "../../components/App/Viewport";

export const ViewportRouteContainer = withRouter<IOwnProps>(Viewport);
