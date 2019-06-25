import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../../components/App/Data/PriceLists/DeleteListDialog";
// tslint:disable-next-line:max-line-length
import { DeleteListDialogContainer } from "../../../../containers/App/Data/PriceLists/DeleteListDialog";

export const DeleteListDialogRouteContainer = withRouter<IOwnProps>(DeleteListDialogContainer);
