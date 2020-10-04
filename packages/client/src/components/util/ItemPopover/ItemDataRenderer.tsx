import React from "react";

import { IShortItem, IShortItemStat, ItemClass } from "@sotah-inc/core";

import { IItemClasses } from "../../../types/global";
import { Currency } from "../Currency";

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
          {item.spells.map((v, spellsIndex) => (
            <li key={spellsIndex} className="on-use">
              {v}
            </li>
          ))}
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
          {item.spells.map((v, spellsIndex) => (
            <li key={spellsIndex} className="on-use">
              {v}
            </li>
          ))}
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
          {item.spells.map((v, spellsIndex) => (
            <li key={spellsIndex} className="on-use">
              {v}
            </li>
          ))}
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
          {item.spells.map((v, spellsIndex) => (
            <li key={spellsIndex} className="on-use">
              {v}
            </li>
          ))}
          <li>{item.level_requirement}</li>
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
    itemDataRenderers.find(v => v.itemClass === item.item_class_id) ?? defaultItemDataRenderer;

  return itemDataRenderer.render(item, itemClasses);
}
