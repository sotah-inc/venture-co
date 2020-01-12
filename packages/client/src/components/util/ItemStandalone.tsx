import React from "react";

import { Position } from "@blueprintjs/core";
import { IItem, ItemId } from "@sotah-inc/core";

import { ItemPopoverContainer } from "../../containers/util/ItemPopover";
import { IFetchData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { qualityToColorClass } from "../../util";

export interface IOwnProps {
  itemId: ItemId;
}

interface IState {
  item: IFetchData<IItem | null>;
}

export class ItemStandalone extends React.Component<IOwnProps, IState> {
  public state: IState = {
    item: {
      data: null,
      errors: {},
      level: FetchLevel.initial,
    },
  };

  public render() {
    const {
      item: { level, errors, data: item },
    } = this.state;

    switch (level) {
      case FetchLevel.success:
        if (item === null) {
          return <em>Item fetch succeeded but item was null.</em>;
        }

        return (
          <ItemPopoverContainer
            interactive={false}
            onItemClick={() => {
              return;
            }}
            position={Position.BOTTOM}
            item={item}
            itemTextFormatter={v => <span className={qualityToColorClass(item.quality)}>{v}</span>}
          />
        );
      case FetchLevel.failure:
        return <em>Failed to fetch item: {errors.error}</em>;
      case FetchLevel.fetching:
        return <em>Fetching item...</em>;
      case FetchLevel.initial:
      default:
        return <em>Loading item...</em>;
    }
  }
}
