import { withRouter } from "react-router-dom";

import { IOwnProps, Profile } from "../../components/App/Profile";

export const ProfileRouteContainer = withRouter<IOwnProps>(Profile);
