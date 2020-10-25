import { IRegionComposite, IShortItem, IShortPet } from "@sotah-inc/core";

import { IClientRealm } from "../types/global";

export const didRegionChange = (
  prevRegion: IRegionComposite | null,
  currentRegion: IRegionComposite,
): boolean => {
  if (prevRegion === null) {
    return true;
  }

  return prevRegion.config_region.name !== currentRegion.config_region.name;
};

export const didRealmChange = (
  prevRealm: IClientRealm | null,
  currentRealm: IClientRealm,
): boolean => {
  if (prevRealm === null) {
    return true;
  }

  return (
    prevRealm.regionName !== currentRealm.regionName ||
    prevRealm.connectedRealmId !== currentRealm.connectedRealmId ||
    prevRealm.realm.id !== prevRealm.realm.id
  );
};

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
