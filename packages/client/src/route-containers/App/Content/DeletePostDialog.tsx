import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../components/App/Content/DeletePostDialog";
import { DeletePostDialogContainer } from "../../../containers/App/Content/DeletePostDialog";

export const DeletePostDialogRouteContainer = withRouter<IOwnProps>(DeletePostDialogContainer);
