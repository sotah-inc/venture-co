import { IAuctionState } from "./auction";
import { IMainState } from "./main";
import { IOvenState } from "./oven";
import { IPostsState } from "./posts";
import { IPriceListsState } from "./price-lists";
import { IProfileState } from "./profile";
import { IWorkOrderState } from "./work-order";

export { defaultMainState } from "./main";
export { defaultAuctionState } from "./auction";
export { defaultOvenState } from "./oven";
export { defaultPostsState } from "./posts";
export { defaultPriceListsState } from "./price-lists";
export { defaultProfileState } from "./profile";
export { defaultWorkOrderState } from "./work-order";

export interface IStoreState {
  Main: IMainState;
  Auction: IAuctionState;
  Oven: IOvenState;
  PriceLists: IPriceListsState;
  Posts: IPostsState;
  Profile: IProfileState;
  WorkOrder: IWorkOrderState;
}
