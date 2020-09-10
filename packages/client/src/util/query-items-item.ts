import { IQueryItemsItem } from "@sotah-inc/core";

export const getSelectedResultIndex = (
  result: IQueryItemsItem,
  selectedItems: IQueryItemsItem[],
): number => {
  if (selectedItems.length === 0) {
    return -1;
  }

  for (let i = 0; i < selectedItems.length; i++) {
    const selectedItem = selectedItems[i];

    if (selectedItem.item !== null) {
      if (
        result.item !== null &&
        result.item.blizzard_meta.id === selectedItem.item.blizzard_meta.id
      ) {
        return Number(i);
      }
    }
  }

  return -1;
};
