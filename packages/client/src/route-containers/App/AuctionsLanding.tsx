import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../components/App/AuctionsLanding";
import { AuctionsLandingContainer } from "../../containers/App/AuctionsLanding";

export const AuctionsLandingRouteContainer = withRouter<IOwnProps>(AuctionsLandingContainer);
