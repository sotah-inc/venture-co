import { IShortItem, ItemClass, ItemSubClass } from "@sotah-inc/core";
import React from "react";

import { IItemClasses } from "../../../types/global";
import { ItemCurrency, renderItemSpells, resolveStatsStrings } from "./ItemDataRenderer/util";

export interface IItemDataRenderer {
  itemClass?: ItemClass;
  itemSubClass?: ItemSubClass;
  render: (item: IShortItem, _itemClasses: IItemClasses) => JSX.Element;
}

export const defaultItemDataRenderer: IItemDataRenderer = {
  render: item => {
    return (
      <>
        <li className="item-level">Item level {item.level}</li>
      </>
    );
  },
};

export const itemDataRenderers: IItemDataRenderer[] = [
  {
    itemClass: ItemClass.Container,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li>{item.binding}</li>
          <li>{item.container_slots}</li>
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Consumable,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {renderItemSpells(item)}
          <li>{item.level_requirement}</li>
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Armor,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li>{item.binding}</li>
          <li className="postscript">{item.item_subclass}</li>
          <li>{item.inventory_type}</li>
          <li>{item.armor}</li>
          {resolveStatsStrings(item.stats).map((v, statsIndex) => (
            <li key={statsIndex} className={v.is_equippable_bonus ? "random-stats" : ""}>
              {v.value}
            </li>
          ))}
          <li>{item.durability}</li>
          {renderItemSpells(item)}
          <li>{item.level_requirement}</li>
          <li>{item.skill_requirement}</li>
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Misc,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {renderItemSpells(item)}
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Tradeskill,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {renderItemSpells(item)}
          <li>{item.level_requirement}</li>
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.Herb,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li>{item.description}</li>
          <li>{item.crafting_reagent}</li>
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.ItemEnhancement,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {renderItemSpells(item)}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
];

export function ItemDataRenderer({
  item,
  itemClasses,
}: {
  item: IShortItem;
  itemClasses: IItemClasses;
}) {
  const itemDataRenderer: IItemDataRenderer =
    itemDataRenderers.find(
      v => v.itemClass === item.item_class_id && v.itemSubClass === item.item_subclass_id,
    ) ??
    itemDataRenderers.find(v => v.itemClass === item.item_class_id) ??
    defaultItemDataRenderer;

  return itemDataRenderer.render(item, itemClasses);
}
