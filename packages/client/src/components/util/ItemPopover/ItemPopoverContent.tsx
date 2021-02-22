import React from "react";

import { IShortItem } from "@sotah-inc/core";

import { IItemClasses } from "../../../types/global";
import { getItemIconUrl, qualityToColorClass } from "../../../util";
import { ItemDataRenderer } from "./ItemDataRenderer";

export function ItemPopoverContent({
  itemClasses,
  item,
}: {
  item: IShortItem;
  itemClasses: IItemClasses;
}): JSX.Element {
  const itemTextClass = qualityToColorClass(item.quality.type);
  const itemIconUrl = getItemIconUrl(item);

  if (itemIconUrl === null) {
    return (
      <div className="item-popover-content">
        <ul>
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
        <div className="pure-u-1-6">
          <p className={itemTextClass} style={{ paddingBottom: "17px", marginBottom: 0 }}>
            <img src={itemIconUrl} className="item-icon" alt="" />
          </p>
        </div>
        <div className="pure-u-5-6">
          <ul>
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
