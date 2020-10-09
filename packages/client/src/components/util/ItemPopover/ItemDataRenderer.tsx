import {
  InventoryType,
  IShortItem,
  IShortItemBase,
  ItemClass,
  ItemSubClass,
} from "@sotah-inc/core";
import React from "react";

import { IItemClasses } from "../../../types/global";
import { getItemTextValue, qualityToColorClass } from "../../../util";
import {
  ItemCurrency,
  renderItemSockets,
  renderItemSpells,
  renderItemStats,
} from "./ItemDataRenderer/util";

function renderArmor(item: IShortItemBase) {
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
      {item.playable_classes && <li>{item.playable_classes}</li>}
      {renderItemSpells(item)}
      <li>{item.level_requirement}</li>
      <li>{item.skill_requirement}</li>
      <ItemCurrency item={item} />
    </>
  );
}

function renderBasicCraftingReagent(item: IShortItemBase) {
  return (
    <>
      <li className="item-level">Item level {item.level}</li>
      <li className="crafting-reagent">{item.crafting_reagent}</li>
      {item.description && <li className="description">"{item.description}"</li>}
      <ItemCurrency item={item} />
    </>
  );
}

function renderProfessionRecipe(item: IShortItem | IShortItemBase, itemClasses: IItemClasses) {
  return (
    <>
      <li className="item-level">Item level {item.level}</li>
      <li className="on-use">Use: {item.description}</li>
      <li>{item.skill_requirement}</li>
      <ItemCurrency item={item} />
      {"recipe_item" in item && (
        <>
          <li>&nbsp;</li>
          <ItemDataRenderer item={item.recipe_item} itemClasses={itemClasses} />
        </>
      )}
      {"reagents_display_string" in item && (
        <>
          <li>&nbsp;</li>
          <li>Requires {item.reagents_display_string}</li>
        </>
      )}
    </>
  );
}

export interface IItemDataRenderer {
  itemClass?: ItemClass;
  itemSubClass?: ItemSubClass;
  render: (item: IShortItem | IShortItemBase, _itemClasses: IItemClasses) => JSX.Element;
}

export const defaultItemDataRenderer: IItemDataRenderer = {
  render: item => {
    return (
      <>
        <li className="item-level">Item level {item.level}</li>
        <li>DEFAULT</li>
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
          {item.reputation_requirement && <li>{item.reputation_requirement}</li>}
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
        [
          InventoryType.Neck,
          InventoryType.OffHand,
          InventoryType.Finger,
          InventoryType.Trinket,
        ].includes(item.inventory_type.type)
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
    itemClass: ItemClass.Misc,
    itemSubClass: ItemSubClass.MiscOther,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.name_description && <li className="name-description">{item.name_description}</li>}
          {renderItemSpells(item)}
          {item.level_requirement && <li>{item.level_requirement}</li>}
          {item.description && <li className="description">"{item.description}"</li>}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Misc,
    itemSubClass: ItemSubClass.MiscMount,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.unique_equipped && <li>{item.unique_equipped}</li>}
          <li>Mount</li>
          {renderItemSpells(item)}
          {item.level_requirement && <li>{item.level_requirement}</li>}
          <li>{item.ability_requirement}</li>
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Misc,
    itemSubClass: ItemSubClass.Junk,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.description && <li className="description">"{item.description}"</li>}
          {item.sell_price && <ItemCurrency item={item} />}
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
          {item.description && <li className="description">"{item.description}"</li>}
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
    itemSubClass: ItemSubClass.TradeskillEnchanting,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li className="crafting-reagent">{item.crafting_reagent}</li>
          {renderItemSpells(item)}
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.MetalAndStone,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li className="crafting-reagent">{item.crafting_reagent}</li>
          {item.description && <li className="description">"{item.description}"</li>}
          {item.skill_requirement && <li>{item.skill_requirement}</li>}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.TradeskillInscription,
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
          {item.description && <li className="description">"{item.description}"</li>}
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
    render: renderProfessionRecipe,
  },
  {
    itemClass: ItemClass.Recipe,
    itemSubClass: ItemSubClass.Leatherworking,
    render: renderProfessionRecipe,
  },
  {
    itemClass: ItemClass.Recipe,
    itemSubClass: ItemSubClass.Tailoring,
    render: renderProfessionRecipe,
  },
  {
    itemClass: ItemClass.Recipe,
    itemSubClass: ItemSubClass.Enchanting,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {renderItemSpells(item)}
          <li>{item.skill_requirement}</li>
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Recipe,
    itemSubClass: ItemSubClass.RecipeJewelcrafting,
    render: renderProfessionRecipe,
  },
  {
    itemClass: ItemClass.Recipe,
    itemSubClass: ItemSubClass.Book,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {renderItemSpells(item)}
          <li>{item.skill_requirement}</li>
          {item.description && <li className="description">"{item.description}"</li>}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Gem,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.limit_category && <li>{item.limit_category}</li>}
          <li>{item.gem_effect}</li>
          {item.level_requirement && <li>{item.level_requirement}</li>}
          {item.gem_min_item_level && <li>{item.gem_min_item_level}</li>}
          {item.description && <li className="description">"{item.description}"</li>}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Quest,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.playable_classes && <li>{item.playable_classes}</li>}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Glyph,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li className="glyph-kind">Minor Glyph</li>
          <li>{item.playable_classes}</li>
          {renderItemSpells({
            ...item,
            spells: item.spells.map(
              v => `Use: Permanently teaches you this glyph.\r\n\r\n${v.substr("Use: ".length)}`,
            ),
          })}
          {item.level_requirement && <li>{item.level_requirement}</li>}
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
  item: IShortItem | IShortItemBase;
  itemClasses: IItemClasses;
}) {
  const itemDataRenderer: IItemDataRenderer =
    itemDataRenderers.find(
      v => v.itemClass === item.item_class_id && v.itemSubClass === item.item_subclass_id,
    ) ??
    itemDataRenderers.find(v => v.itemClass === item.item_class_id) ??
    defaultItemDataRenderer;
  const itemTextClass = qualityToColorClass(item.quality.type);
  const itemText = getItemTextValue(item);

  return (
    <>
      <li className={itemTextClass}>{itemText}</li>
      {itemDataRenderer.render(item, itemClasses)}
    </>
  );
}
