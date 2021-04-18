import * as zlib from "zlib";

export * from "./config";

export function gunzip(data: Buffer): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    zlib.gunzip(data, (err, result) => {
      if (err) {
        reject(err);

        return;
      }

      resolve(result);
    });
  });
}

export function gzip(data: Buffer): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    zlib.gzip(data, (err, result) => {
      if (err) {
        reject(err);

        return;
      }

      resolve(result);
    });
  });
}
