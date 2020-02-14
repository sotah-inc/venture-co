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
