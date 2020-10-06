import { IShortItem, IShortItemStat, ItemClass, ItemSubClass } from "@sotah-inc/core";
import React from "react";

import { IItemClasses } from "../../../types/global";
import { Currency } from "../Currency";

export function renderItemSpells(item: IShortItem) {
  return item.spells.map((v, spellsIndex) => (
    <li key={spellsIndex} className="on-use">
      {v}
    </li>
  ));
}

export function ItemCurrency({ item }: { item: IShortItem }) {
  if (item.sell_price.value === 0) {
    return null;
  }

  return (
    <li>
      {item.sell_price.header}{" "}
      <Currency amount={item.sell_price.value} hideCopper={item.sell_price.value > 100} />
    </li>
  );
}

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

interface ResolvedStats {
  value: string;
  is_equippable_bonus: boolean;
}

export function resolveStatsStrings(stats: IShortItemStat[]): ResolvedStats[] {
  return stats.reduce<ResolvedStats[]>((result, v, i, initialInput) => {
    if (v.is_negated && i > 0) {
      return [
        ...result.slice(0, i - 1),
        {
          is_equippable_bonus: v.is_equip_bonus,
          value: `+${v.value} [${[initialInput[i].type, initialInput[i - 1].type].join(" or ")}]`,
        },
      ];
    }

    return [
      ...result,
      {
        is_equippable_bonus: v.is_equip_bonus,
        value: v.display_value,
      },
    ];
  }, []);
}

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
