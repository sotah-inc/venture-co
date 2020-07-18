import { handlers as auctionHandlers, run as auctionRunner } from "./auction";
import { handlers as mainHandlers, run as mainRunner } from "./main";
import { handlers as postsHandlers, run as postsRunner } from "./posts";
import { handlers as pricelistsHandlers, run as pricelistsRunner } from "./price-lists";
import { handlers as profileHandlers, run as profileRunner } from "./profile";
import { handlers as workOrderHandlers, run as workOrderRunner } from "./work-order";

export interface IKindHandlers<T, A> {
  [key: string]: IVerbHandlers<T, A> | undefined;
}

export interface IVerbHandlers<T, A> {
  [key: string]: ITaskHandlers<T, A> | undefined;
}

export interface ITaskHandlers<T, A> {
  [key: string]: Runner<T, A> | undefined;
}

export type Runner<T, A> = (x: T, y: A) => T;

export const runners = {
  auction: auctionRunner,
  main: mainRunner,
  post: postsRunner,
  pricelist: pricelistsRunner,
  profile: profileRunner,
  workOrder: workOrderRunner,
};

export const handlers = {
  auction: auctionHandlers,
  main: mainHandlers,
  post: postsHandlers,
  pricelist: pricelistsHandlers,
  profile: profileHandlers,
  workOrder: workOrderHandlers,
};
