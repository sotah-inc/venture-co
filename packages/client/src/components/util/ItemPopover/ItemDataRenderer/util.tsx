import React from "react";

import { IShortItemBase, IShortItemStat } from "@sotah-inc/core";

import { Currency } from "../../Currency";

export function renderItemSpells(item: IShortItemBase) {
  return item.spells.map((v, spellsIndex) => (
    <li key={spellsIndex} className="on-use">
      {v}
    </li>
  ));
}

export function ItemCurrency({ item }: { item: IShortItemBase }) {
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

interface ResolvedStats {
  value: string;
  is_equippable_bonus: boolean;
}

export function resolveStatsStrings(stats: IShortItemStat[]): ResolvedStats[] {
  return stats.reduce<ResolvedStats[]>((result, v, i, initialInput) => {
    if (v.is_negated && i > 0) {
      const priorStat = initialInput[i - 1];

      if (priorStat.value === v.value) {
        return [
          ...result.slice(0, i - 1),
          {
            is_equippable_bonus: v.is_equip_bonus,
            value: `+${v.value} [${[initialInput[i].type, initialInput[i - 1].type].join(" or ")}]`,
          },
        ];
      }
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

export function renderItemStats(item: IShortItemBase) {
  return resolveStatsStrings(item.stats).map((v, statsIndex) => (
    <li key={statsIndex} className={v.is_equippable_bonus ? "random-stats" : ""}>
      {v.value}
    </li>
  ));
}

export function renderItemSockets(item: IShortItemBase) {
  if (item.sockets.length === 0) {
    return null;
  }

  return (
    <>
      <li>&nbsp;</li>
      {item.sockets.map((v, socketIndex) => (
        <li key={socketIndex}>{v.name}</li>
      ))}
      {item.socket_bonus && <li>{item.socket_bonus}</li>}
      <li>&nbsp;</li>
    </>
  );
}
