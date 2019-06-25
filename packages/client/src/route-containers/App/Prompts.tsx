import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../components/App/Prompts";
import { PromptsContainer } from "../../containers/App/Prompts";

export const PromptsRouteContainer = withRouter<IOwnProps>(PromptsContainer);
