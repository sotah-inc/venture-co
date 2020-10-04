import React from "react";

import { IShortItem } from "@sotah-inc/core";

import { IItemClasses } from "../../../types/global";
import { getItemIconUrl, getItemTextValue, qualityToColorClass } from "../../../util";
import { ItemDataRenderer } from "./ItemDataRenderer";

export function ItemPopoverContent({
  itemClasses,
  item,
}: {
  item: IShortItem;
  itemClasses: IItemClasses;
}) {
  const itemTextClass = qualityToColorClass(item.quality.type);
  const itemIconUrl = getItemIconUrl(item);
  const itemText = getItemTextValue(item);

  if (itemIconUrl === null) {
    return (
      <div className="item-popover-content">
        <ul>
          <li className={itemTextClass}>{itemText}</li>
          <ItemDataRenderer item={item} itemClasses={itemClasses} />
        </ul>
        <hr />
        <ul>
          <li>Item id: {item.id}</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="item-popover-content">
      <div className="pure-g">
        <div className="pure-u-1-5">
          <p className={itemTextClass} style={{ paddingBottom: "17px", marginBottom: 0 }}>
            <img src={itemIconUrl} className="item-icon" alt="" />
          </p>
        </div>
        <div className="pure-u-4-5">
          <ul>
            <li className={itemTextClass}>{itemText}</li>
            <ItemDataRenderer item={item} itemClasses={itemClasses} />
          </ul>
          <hr />
          <ul>
            <li>Item id: {item.id}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
