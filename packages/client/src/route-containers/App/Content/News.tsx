import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../components/App/Content/News";
import { NewsContainer } from "../../../containers/App/Content/News";

export const NewsRouteContainer = withRouter<IOwnProps>(NewsContainer);
