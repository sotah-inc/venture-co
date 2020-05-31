import * as zlib from "zlib";

import { RegionName } from "@sotah-inc/core";
import moment from "moment";

import { IRealmModificationDatesResponse } from "../messenger/contracts";

export * from "./config";

export const gunzip = (data: Buffer): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    zlib.gunzip(data, (err, result) => {
      if (err) {
        reject(err);

        return;
      }

      resolve(result);
    });
  });
};

export const getLatestRealmModifiedDate = (
  regionName: RegionName,
  res: IRealmModificationDatesResponse,
): Date | null => {
  const realmModDates = res[regionName];
  if (typeof realmModDates === "undefined") {
    return null;
  }

  const latestDownloaded = Object.values(realmModDates).reduce<number | null>(
    (result, modDates) => {
      if (typeof modDates === "undefined") {
        return null;
      }

      if (result === null || modDates.downloaded > result) {
        return modDates.downloaded;
      }

      return result;
    },
    null,
  );

  if (latestDownloaded === null) {
    return null;
  }

  return moment(latestDownloaded * 1000)
    .utc()
    .toDate();
};
