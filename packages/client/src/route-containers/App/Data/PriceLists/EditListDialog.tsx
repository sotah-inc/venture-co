import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../../components/App/Data/PriceLists/EditListDialog";
import { EditListDialogContainer } from "../../../../containers/App/Data/PriceLists/EditListDialog";

export const EditListDialogRouteContainer = withRouter<IOwnProps>(EditListDialogContainer);
