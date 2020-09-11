import React from "react";

import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import { IShortItem } from "@sotah-inc/core";

import { IItemClasses } from "../../types/global";
import { getItemIconUrl, getItemTextValue, qualityToColorClass } from "../../util";

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

const renderData = (item: IShortItem, _itemClasses: IItemClasses) => {
  return item.id;
};

const renderPopoverContent = (item: IShortItem, itemClasses: IItemClasses) => {
  const itemTextClass = qualityToColorClass(item.quality.type);
  const itemIconUrl = getItemIconUrl(item);
  const itemText = getItemTextValue(item);

  if (itemIconUrl === null) {
    return (
      <div className="item-popover-content">
        <ul>
          <li className={itemTextClass}>{itemText}</li>
          {renderData(item, itemClasses)}
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
            {renderData(item, itemClasses)}
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
    const { item, itemClasses, position } = this.props;

    return (
      <Popover
        content={renderPopoverContent(item, itemClasses)}
        target={this.renderPopoverTarget(item)}
        interactionKind={PopoverInteractionKind.HOVER}
        position={position ?? Position.RIGHT}
      />
    );
  }

  private onItemClick() {
    const { onItemClick } = this.props;
    if (!onItemClick) {
      return;
    }

    onItemClick();
  }

  private itemTextFormatter(itemText: string) {
    const { itemTextFormatter } = this.props;
    if (typeof itemTextFormatter === "undefined") {
      return itemText;
    }

    return itemTextFormatter(itemText);
  }

  private renderDisplay(item: IShortItem) {
    const itemIconUrl = getItemIconUrl(item);
    if (itemIconUrl === null) {
      return this.renderLink(item);
    }

    return (
      <>
        <img src={itemIconUrl} className="item-icon" alt="" /> {this.renderLink(item)}
      </>
    );
  }

  private renderLink(item: IShortItem) {
    const { interactive } = this.props;

    const itemText = this.itemTextFormatter(getItemTextValue(item));

    if (typeof interactive === "undefined" || interactive) {
      return <a onClick={() => this.onItemClick()}>{itemText}</a>;
    }

    return itemText;
  }

  private renderPopoverTarget(item: IShortItem) {
    return <div className="item-icon-container">{this.renderDisplay(item)}</div>;
  }
}
