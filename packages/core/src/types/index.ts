export * from "./contracts";
export * from "./auction";
export * from "./entities";
export * from "./expansion";
export * from "./item";
export * from "./item-class";
export * from "./pricelist";
export * from "./profession";
export * from "./region";
export * from "./token";
export * from "./work-order";

export enum SortDirection {
  none,
  up,
  down,
}

export enum SortKind {
  none,
  item,
  quantity,
  bid,
  buyout,
  buyoutPer,
  auctions,
  owner,
}

export enum SortPerPage {
  Ten = 10,
  Fifty = 50,
  OneHundred = 100,
}

export enum GameVersion {
  Retail = "retail",
  Classic = "classic",
}

export interface ILinksBase {
  _links: {
    self: IHrefReference;
  };
}

export interface ILocaleMapping {
  [key: string]: string;
}

export interface IHrefReference {
  href: string;
}

export type UnixTimestamp = number;

export enum Locale {
  EnUS = "en_US",
  EsMX = "es_MX",
  PtBR = "pt_BR",
  DeDE = "de_DE",
  EnGB = "en_GB",
  EsES = "es_ES",
  FrFR = "fr_FR",
  ItIT = "it_IT",
  RuRU = "ru_RU",
  KoKR = "ko_KR",
  ZhTW = "zh_TW",
  ZhCN = "zh_CN",
}
