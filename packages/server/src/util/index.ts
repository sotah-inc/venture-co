import * as zlib from "zlib";

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
