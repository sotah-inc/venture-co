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

export const getEarliestRealmModifiedDate = (
  regionName: RegionName,
  res: IRealmModificationDatesResponse,
): Date | null => {
  if (!(regionName in res)) {
    return null;
  }

  const realmModDates = res[regionName];

  const earliestDownloaded = Object.values(realmModDates).reduce<number | null>(
    (result, modDates) => {
      if (result === null || modDates.downloaded < result) {
        return modDates.downloaded;
      }

      return result;
    },
    null,
  );

  if (earliestDownloaded === null) {
    return null;
  }

  return moment(earliestDownloaded * 1000)
    .utc()
    .toDate();
};
