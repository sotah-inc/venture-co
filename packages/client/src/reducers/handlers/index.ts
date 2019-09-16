import { handlers as mainHandlers, run as mainRunner } from "./main";
import { handlers as postsHandlers, run as postsRunner } from "./posts";
import { handlers as pricelistsHandlers, run as pricelistsRunner } from "./price-lists";
import { handlers as profileHandlers, run as profileRunner } from "./profile";

export interface IKindHandlers<T, A> {
  [key: string]: IVerbHandlers<T, A>;
}

export interface IVerbHandlers<T, A> {
  [key: string]: ITaskHandlers<T, A>;
}

export interface ITaskHandlers<T, A> {
  [key: string]: (state: T, action: A) => T;
}

export type Runner<T, A> = (x: T, y: A) => T;

export const runners = {
  main: mainRunner,
  post: postsRunner,
  pricelist: pricelistsRunner,
  profile: profileRunner,
};

export const handlers = {
  main: mainHandlers,
  post: postsHandlers,
  pricelist: pricelistsHandlers,
  profileHandlers,
};
