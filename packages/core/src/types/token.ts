export interface IRegionTokenHistory {
  [unixTimestamp: number]: number | undefined;
}

export interface IShortTokenHistory {
  [unixTimestamp: number]:
    | {
        [regionName: string]: number | undefined;
      }
    | undefined;
}
