import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../components/App/Data/Realm";
import { RealmContainer } from "../../../containers/App/Data/Realm";

export const RealmRouteContainer = withRouter<IOwnProps>(RealmContainer);
