import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../components/App/ProfessionsLanding";
import { ProfessionsLandingContainer } from "../../containers/App/ProfessionsLanding";

export const ProfessionsLandingRouteContainer = withRouter<IOwnProps>(ProfessionsLandingContainer);
