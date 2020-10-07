import { InventoryType, IShortItem, ItemClass, ItemSubClass } from "@sotah-inc/core";
import React from "react";

import { IItemClasses } from "../../../types/global";
import {
  ItemCurrency,
  renderItemSockets,
  renderItemSpells,
  renderItemStats,
} from "./ItemDataRenderer/util";

function renderArmor(item: IShortItem) {
  return (
    <>
      <li className="item-level">Item level {item.level}</li>
      <li>{item.binding}</li>
      {item.unique_equipped && <li>{item.unique_equipped}</li>}
      {item.item_subclass_id !== ItemSubClass.Misc && (
        <li className="postscript">{item.item_subclass}</li>
      )}
      <li>{item.inventory_type.display_string}</li>
      <li>{item.armor}</li>
      {renderItemStats(item)}
      {renderItemSockets(item)}
      <li>{item.durability}</li>
      {renderItemSpells(item)}
      <li>{item.level_requirement}</li>
      <li>{item.skill_requirement}</li>
      <ItemCurrency item={item} />
    </>
  );
}

function renderBasicCraftingReagent(item: IShortItem) {
  return (
    <>
      <li className="item-level">Item level {item.level}</li>
      <li className="crafting-reagent">{item.crafting_reagent}</li>
      {item.description && <li className="description">{item.description}</li>}
      <ItemCurrency item={item} />
    </>
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
    render: renderArmor,
  },
  {
    itemClass: ItemClass.Armor,
    itemSubClass: ItemSubClass.Misc,
    render: item => {
      if (
        [InventoryType.Neck, InventoryType.OffHand, InventoryType.Finger].includes(
          item.inventory_type.type,
        )
      ) {
        return renderArmor(item);
      }

      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li>{item.binding}</li>
          <li>{item.inventory_type.display_string}</li>
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
          <li className="crafting-reagent">{item.crafting_reagent}</li>
          <li>{item.description}</li>
          {renderItemSpells(item)}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.Elemental,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li className="crafting-reagent">{item.crafting_reagent}</li>
          <li className="description">"{item.description}"</li>
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.Jewelcrafting,
    render: renderBasicCraftingReagent,
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.Other,
    render: renderBasicCraftingReagent,
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.Cooking,
    render: renderBasicCraftingReagent,
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.Leather,
    render: renderBasicCraftingReagent,
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.Cloth,
    render: renderBasicCraftingReagent,
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.MetalAndStone,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li className="crafting-reagent">{item.crafting_reagent}</li>
          {item.skill_requirement && <li>{item.skill_requirement}</li>}
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
  {
    itemClass: ItemClass.Weapon,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li>{item.binding}</li>
          <li className="postscript">{item.item_subclass}</li>
          <li>{item.inventory_type.display_string}</li>
          <li className="postscript">{item.attack_speed}</li>
          <li>{item.damage}</li>
          <li>{item.dps}</li>
          {renderItemStats(item)}
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
    itemClass: ItemClass.BattlePets,
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
    itemClass: ItemClass.Recipe,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.unique_equipped && <li>{item.unique_equipped}</li>}
          <li>{item.level_requirement}</li>
          <li className="description">"{item.description}"</li>
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Recipe,
    itemSubClass: ItemSubClass.Blacksmithing,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li className="on-use">Use: {item.description}</li>
          <li>{item.skill_requirement}</li>
          <ItemCurrency item={item} />
          <li>&nbsp;</li>
          <li>Requires {item.reagents_display_string}</li>
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
