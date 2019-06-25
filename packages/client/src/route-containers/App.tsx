import { withRouter } from "react-router-dom";

import { IOwnProps } from "../components/App";
import { AppContainer } from "../containers/App";

export const AppRouteContainer = withRouter<IOwnProps>(AppContainer);
