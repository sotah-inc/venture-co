import { combineReducers } from "redux";

import { auction } from "./auction";
import { main } from "./main";
import { oven } from "./oven";
import { posts } from "./posts";
import { priceLists } from "./price-lists";
import { professions } from "./professions";
import { profile } from "./profile";
import { workOrder } from "./work-order";

export const rootReducer = combineReducers({
  Auction: auction,
  Main: main,
  Oven: oven,
  Posts: posts,
  PriceLists: priceLists,
  Professions: professions,
  Profile: profile,
  WorkOrder: workOrder,
});
