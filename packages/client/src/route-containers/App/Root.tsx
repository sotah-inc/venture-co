import { withRouter } from "react-router-dom";

import { IOwnProps, Root } from "../../components/App/Root";

export const RootRouteContainer = withRouter<IOwnProps>(Root);
