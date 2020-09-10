import React from "react";

import { IShortItem } from "@sotah-inc/core";

import { getItemIconUrl } from "../../util";

export interface IOwnProps {
  item: IShortItem;
}

type Props = Readonly<IOwnProps>;

export function ItemIcon({ item }: Props) {
  const itemIconUrl = getItemIconUrl(item);
  if (itemIconUrl === null) {
    return null;
  }

  return <img src={itemIconUrl} className="item-icon" alt="" />;
}
