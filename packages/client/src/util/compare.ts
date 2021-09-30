import { IConfigRegion, IShortItem, IShortPet } from "@sotah-inc/core";

import { IClientRealm } from "../types/global";

export function didRegionChange(
  prevRegion: IConfigRegion | null,
  currentRegion: IConfigRegion,
): boolean {
  if (prevRegion === null) {
    return true;
  }

  return prevRegion.name !== currentRegion.name;
}

export function didRealmChange(
  prevRealm: IClientRealm | null,
  currentRealm: IClientRealm,
): boolean {
  if (prevRealm === null) {
    return true;
  }

  return (
    prevRealm.regionName !== currentRealm.regionName ||
    prevRealm.connectedRealmId !== currentRealm.connectedRealmId ||
    prevRealm.realm.id !== prevRealm.realm.id
  );
}

export function hasNewItems(firstList: IShortItem[], secondList: IShortItem[]): boolean {
  return diff(new Set(firstList.map(v => v.id)), new Set(secondList.map(v => v.id))).size > 0;
}

export function hasNewPets(firstList: IShortPet[], secondList: IShortPet[]): boolean {
  return diff(new Set(firstList.map(v => v.id)), new Set(secondList.map(v => v.id))).size > 0;
}

export function diff<T>(firstSet: Set<T>, secondSet: Set<T>): Set<T> {
  const out = new Set<T>(firstSet);
  secondSet.forEach(v => out.delete(v));

  return out;
}
