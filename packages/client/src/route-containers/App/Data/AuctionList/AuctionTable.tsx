import { withRouter } from "react-router-dom";

import { IOwnProps } from "../../../../components/App/Data/AuctionList/AuctionTable";
import { AuctionTableContainer } from "../../../../containers/App/Data/AuctionList/AuctionTable";

export const AuctionTableRouteContainer = withRouter<IOwnProps>(AuctionTableContainer);
