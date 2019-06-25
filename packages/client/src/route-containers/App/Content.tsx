import { withRouter } from "react-router-dom";

import { Content, IOwnProps } from "../../components/App/Content";

export const ContentRouteContainer = withRouter<IOwnProps>(Content);
