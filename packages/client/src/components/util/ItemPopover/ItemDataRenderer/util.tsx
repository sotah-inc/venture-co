import React from "react";

import { IShortItemBase, IShortItemStat, PlayableClass } from "@sotah-inc/core";

import { Currency } from "../../Currency";

export function renderItemSpells(item: IShortItemBase) {
  return item.spells.map((v, spellsIndex) => {
    const output = (() => {
      if (v.includes("\r\n")) {
        return v.split("\r\n").map((splitResult, splitIndex) => {
          return (
            <React.Fragment key={splitIndex}>
              {splitIndex > 0 && <br />}
              {splitResult}
            </React.Fragment>
          );
        });
      }

      return v;
    })();

    return (
      <li key={spellsIndex} className="on-use">
        {output}
      </li>
    );
  });
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

export interface PlayableClassClassNameMap {
  [key: number]: string | undefined;
}

export const playableClassClassNameMap: PlayableClassClassNameMap = {
  [PlayableClass.Hunter]: "hunter",
};

export function resolvePlayableClassClassName(playableClass: PlayableClass): string {
  return playableClassClassNameMap[playableClass] ?? "";
}

export function renderPlayableClasses(item: IShortItemBase) {
  if (item.playable_classes.length === 0) {
    return null;
  }

  return (
    <li className="class-labels">
      Classes:{" "}
      {item.playable_classes
        .map((v, playableClassIndex) => (
          <span className={resolvePlayableClassClassName(v.id)} key={playableClassIndex}>
            {v.name}
          </span>
        ))
        .join(", ")}
    </li>
  );
}
