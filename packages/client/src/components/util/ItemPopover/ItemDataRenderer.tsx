import React from "react";

import {
  IItemClass,
  InventoryType,
  IShortItem,
  IShortItemBase,
  ItemClass,
  ItemSubClass,
} from "@sotah-inc/core";

import { getItemTextValue, qualityToColorClass } from "../../../util";
import {
  ItemCurrency,
  renderItemSet,
  renderItemSockets,
  renderItemSpells,
  renderItemStats,
  renderPlayableClasses,
} from "./ItemDataRenderer/util";

function renderArmor(item: IShortItemBase): JSX.Element {
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
      {renderPlayableClasses(item)}
      {renderItemSpells(item)}
      <li>{item.level_requirement}</li>
      <li>{item.skill_requirement}</li>
      {renderItemSet(item)}
      <ItemCurrency item={item} />
    </>
  );
}

function renderBasicCraftingReagent(item: IShortItemBase): JSX.Element {
  return (
    <>
      <li className="item-level">Item level {item.level}</li>
      {item.crafting_reagent && <li className="crafting-reagent">{item.crafting_reagent}</li>}
      {renderItemSpells(item)}
      {item.level_requirement && <li>{item.level_requirement}</li>}
      {item.description && <li className="description">&quo;{item.description}&quo;</li>}
      {item.sell_price.value > 0 && <ItemCurrency item={item} />}
    </>
  );
}

function renderProfessionRecipe(
  item: IShortItem | IShortItemBase,
  itemClasses: IItemClass[],
): JSX.Element {
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
  render: (item: IShortItem | IShortItemBase, _itemClasses: IItemClass[]) => JSX.Element;
}

export const defaultItemDataRenderer: IItemDataRenderer = {
  render(item) {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {renderItemSpells(item)}
          {item.description && <li className="description">&quot;{item.description}&quot;</li>}
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.name_description && <li className="name-description">{item.name_description}</li>}
          {renderItemSpells(item)}
          {item.level_requirement && <li>{item.level_requirement}</li>}
          {item.description && <li className="description">&quot;{item.description}&quot;</li>}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Misc,
    itemSubClass: ItemSubClass.MiscMount,
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.description && <li className="description">&quot;{item.description}&quot;</li>}
          {item.sell_price && <ItemCurrency item={item} />}
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Tradeskill,
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li className="crafting-reagent">{item.crafting_reagent}</li>
          {item.description && <li className="description">&quot;{item.description}&quot;</li>}
          {renderItemSpells(item)}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.Elemental,
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li className="crafting-reagent">{item.crafting_reagent}</li>
          {item.description && <li className="description">&quot;{item.description}&quot;</li>}
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
    itemSubClass: ItemSubClass.TradeskillOther,
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li className="crafting-reagent">{item.crafting_reagent}</li>
          {item.description && <li className="description">&quot;{item.description}&quot;</li>}
          {item.skill_requirement && <li>{item.skill_requirement}</li>}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Tradeskill,
    itemSubClass: ItemSubClass.TradeskillInscription,
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
          {item.description && <li className="description">&quot;{item.description}&quot;</li>}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.BattlePets,
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.unique_equipped && <li>{item.unique_equipped}</li>}
          <li>{item.level_requirement}</li>
          <li className="description">&quot;{item.description}&quot;</li>
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
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
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {renderItemSpells(item)}
          <li>{item.skill_requirement}</li>
          {item.description && <li className="description">&quot;{item.description}&quot;</li>}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Recipe,
    itemSubClass: ItemSubClass.RecipeCooking,
    render: renderProfessionRecipe,
  },
  {
    itemClass: ItemClass.Gem,
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.limit_category && <li>{item.limit_category}</li>}
          <li>{item.gem_effect}</li>
          {item.level_requirement && <li>{item.level_requirement}</li>}
          {item.gem_min_item_level && <li>{item.gem_min_item_level}</li>}
          {item.description && <li className="description">&quot;{item.description}&quot;</li>}
          <ItemCurrency item={item} />
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Quest,
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          {item.item_starts_quest && <li>{item.item_starts_quest}</li>}
          {item.level_requirement && <li>{item.level_requirement}</li>}
          {renderPlayableClasses(item)}
          {item.description && <li className="description">&quot;{item.description}&quot;</li>}
          {item.sell_price.value > 0 && <ItemCurrency item={item} />}
        </>
      );
    },
  },
  {
    itemClass: ItemClass.Glyph,
    render(item: IShortItem | IShortItemBase): JSX.Element {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li className="glyph-kind">Minor Glyph</li>
          {renderPlayableClasses(item)}
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
  itemClasses: IItemClass[];
}): JSX.Element {
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
