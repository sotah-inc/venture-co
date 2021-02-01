import { zeroGraphValue } from "../graph";

export function minDataDomain(dataMin: number): number {
  if (dataMin <= 1) {
    return zeroGraphValue;
  }

  const result = Math.pow(10, Math.floor(Math.log10(dataMin)));
  if (result === 0) {
    return zeroGraphValue;
  }

  return dataMin - (dataMin % result);
}

export function maxDataDomain(dataMax: number): number {
  if (dataMax <= 1) {
    return 10;
  }

  const result = Math.pow(10, Math.floor(Math.log10(dataMax)));
  if (result === 0) {
    return zeroGraphValue;
  }

  return dataMax - (dataMax % result) + result;
}
