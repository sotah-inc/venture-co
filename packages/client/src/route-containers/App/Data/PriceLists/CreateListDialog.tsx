import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../../components/App/Data/PriceLists/CreateListDialog";
// tslint:disable-next-line:max-line-length
import { CreateListDialogContainer } from "../../../../containers/App/Data/PriceLists/CreateListDialog";

export const CreateListDialogRouteContainer = withRouter<IOwnProps>(CreateListDialogContainer);
