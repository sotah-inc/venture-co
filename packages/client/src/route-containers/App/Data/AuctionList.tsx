import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../components/App/Data/AuctionList";
import { AuctionsListContainer } from "../../../containers/App/Data/AuctionList";

export const AuctionListRouteContainer = withRouter<IOwnProps>(AuctionsListContainer);
