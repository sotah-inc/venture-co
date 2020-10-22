import { IQueryItem, IShortItem } from "@sotah-inc/core";

export const getSelectedResultIndex = (
  result: IQueryItem<IShortItem>,
  selectedItems: Array<IQueryItem<IShortItem>>,
): number => {
  if (selectedItems.length === 0) {
    return -1;
  }

  for (let i = 0; i < selectedItems.length; i++) {
    const selectedItem = selectedItems[i];

    if (selectedItem.item !== null) {
      if (result.item !== null && result.item.id === selectedItem.item.id) {
        return Number(i);
      }
    }
  }

  return -1;
};
