import React from "react";

import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import { IShortItem, ItemClass } from "@sotah-inc/core";

import { IItemClasses } from "../../types/global";
import { getItemIconUrl, getItemTextValue, qualityToColorClass } from "../../util";
import { ItemLink } from "./ItemLink";

export interface IStateProps {
  itemClasses: IItemClasses;
}

type ItemTextFormatterResult = string | React.ReactNode;

export interface IOwnProps {
  item: IShortItem;

  onItemClick?: () => void;
  itemTextFormatter?: (itemText: string) => ItemTextFormatterResult;
  position?: Position;
  interactive?: boolean;
}

type Props = Readonly<IStateProps & IOwnProps>;

interface IItemDataRenderer {
  itemClass?: ItemClass;
  render: (item: IShortItem, _itemClasses: IItemClasses) => JSX.Element;
}

const defaultItemDataRenderer: IItemDataRenderer = {
  render: item => {
    return (
      <>
        <li className="item-level">Item level {item.level}</li>
        <li>{item.binding}</li>
        <li>{item.container_slots}</li>
      </>
    );
  },
};

const itemDataRenderers: IItemDataRenderer[] = [
  {
    itemClass: ItemClass.Container,
    render: item => {
      return (
        <>
          <li className="item-level">Item level {item.level}</li>
          <li>{item.binding}</li>
          <li>{item.container_slots}</li>
        </>
      );
    },
  },
];

const renderPopoverContent = (item: IShortItem, itemClasses: IItemClasses) => {
  const itemTextClass = qualityToColorClass(item.quality.type);
  const itemIconUrl = getItemIconUrl(item);
  const itemText = getItemTextValue(item);
  const itemDataRenderer: IItemDataRenderer =
    itemDataRenderers.find(v => v.itemClass === item.itemClassId) ?? defaultItemDataRenderer;

  if (itemIconUrl === null) {
    return (
      <div className="item-popover-content">
        <ul>
          <li className={itemTextClass}>{itemText}</li>
          {itemDataRenderer.render(item, itemClasses)}
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
            {itemDataRenderer.render(item, itemClasses)}
          </ul>
          <hr />
          <ul>
            <li>Item id: {item.id}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export class ItemPopover extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    itemTextFormatter: (itemText: string) => itemText,
    onItemClick: () => {
      return;
    },
  };

  public render() {
    const { item, itemClasses, position, interactive, itemTextFormatter, onItemClick } = this.props;

    return (
      <Popover
        content={renderPopoverContent(item, itemClasses)}
        target={
          <ItemLink
            item={item}
            interactive={interactive}
            itemTextFormatter={itemTextFormatter}
            onItemClick={onItemClick}
          />
        }
        interactionKind={PopoverInteractionKind.HOVER}
        position={position ?? Position.RIGHT}
      />
    );
  }
}
