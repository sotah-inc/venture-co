import { IConfigRegion } from "@sotah-inc/core";
import moment from "moment";

import { IRegions } from "../types/global";

export * from "./compare";
export * from "./currency";
export * from "./extract-string";
export * from "./graph";
export * from "./item";
export * from "./query-items-item";
export * from "./routes";
export * from "./slider";
export * from "./pet";

const hostname: string = (() => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.hostname;
})();

export const title: string =
  hostname === "localhost" ? "SotAH (DEV)" : "Secrets of the Auction House";

export function setTitle(prefix: string): void {
  if (typeof document === "undefined") {
    return;
  }

  document.title = `${prefix} - ${title}`;
}

export function unixTimestampToText(unixTimestamp: number): string {
  return moment(new Date(unixTimestamp * 1000)).format("MMM D");
}

export function getColor(index: number): string {
  const choices = [
    "#AD99FF",
    "#669EFF",
    "#43BF4D",
    "#D99E0B",
    "#FF6E4A",
    "#C274C2",
    "#2EE6D6",
    "#FF66A1",
    "#D1F26D",
    "#C99765",
    "#669EFF",
  ];

  return choices[index % choices.length];
}

export function FormatRegionList(regionList: IConfigRegion[]): IRegions {
  return regionList.reduce((result, region) => {
    return { ...result, [region.name]: region };
  }, {});
}
