import React from "react";

import { IShortItem } from "@sotah-inc/core";

import { getItemIconUrl, getItemTextValue } from "../../util";

type ItemTextFormatterResult = string | React.ReactNode;

export interface IOwnProps {
  item: IShortItem;

  onItemClick?: () => void;
  itemTextFormatter?: (itemText: string) => ItemTextFormatterResult;
  interactive?: boolean;
}

type Props = Readonly<IOwnProps>;

export class ItemLink extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    itemTextFormatter: (itemText: string) => itemText,
    onItemClick: () => {
      return;
    },
  };

  public render() {
    const { item } = this.props;

    return <div className="item-icon-container">{this.renderDisplay(item)}</div>;
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
}
