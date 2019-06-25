import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../components/App/Profile/ManageAccount";
import { ManageAccountContainer } from "../../../containers/App/Profile/ManageAccount";

export const ManageAccountRouteContainer = withRouter<IOwnProps>(ManageAccountContainer);
