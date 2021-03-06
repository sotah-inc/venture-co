import React from "react";

import { IShortItem } from "@sotah-inc/core";

import { getItem } from "../../api/items";
import { ItemPopoverContainer } from "../../containers/util/ItemPopover";
import { IFetchData } from "../../types/global";
import { FetchLevel } from "../../types/main";
import { qualityToColorClass } from "../../util";

export interface IOwnProps {
  itemId?: string;
}

interface IState {
  item: IFetchData<IShortItem | null>;
}

type Props = Readonly<IOwnProps>;

export class ItemStandalone extends React.Component<Props, IState> {
  public state: IState = {
    item: {
      data: null,
      errors: {},
      level: FetchLevel.initial,
    },
  };

  public async componentDidMount(): Promise<void> {
    const { itemId } = this.props;

    await this.handleItemId(itemId);
  }

  public async componentDidUpdate(prevProps: Props): Promise<void> {
    const { itemId } = this.props;

    if (prevProps.itemId === itemId) {
      return;
    }

    await this.handleItemId(itemId);
  }

  public render(): React.ReactNode {
    const {
      item: { level, errors, data: item },
    } = this.state;

    switch (level) {
    case FetchLevel.success:
      if (item === null) {
        return <em>Item fetch succeeded but item was null.</em>;
      }

      return (
        <span className="item-standalone">
          <ItemPopoverContainer
            interactive={false}
            onItemClick={() => {
              return;
            }}
            placement={"bottom"}
            item={item}
            itemTextFormatter={v => (
              <span className={qualityToColorClass(item.quality.type)}>{v}</span>
            )}
          />
        </span>
      );
    case FetchLevel.failure:
      return <em>Failed to fetch item: {errors.error}</em>;
    case FetchLevel.initial:
    default:
      return <em>Loading item...</em>;
    }
  }

  private handleItemId(itemId?: string) {
    (async () => {
      if (typeof itemId === "undefined" || itemId.length === 0) {
        this.setState({
          ...this.state,
          item: {
            ...this.state.item,
            errors: { error: "ItemId cannot be blank" },
            level: FetchLevel.failure,
          },
        });

        return;
      }

      const foundItemId = parseInt(itemId, 10);

      if (isNaN(foundItemId) || foundItemId.toString() !== itemId) {
        this.setState({
          ...this.state,
          item: {
            ...this.state.item,
            errors: { error: "ItemId must be a number" },
            level: FetchLevel.failure,
          },
        });

        return;
      }

      const { item, error } = await getItem(foundItemId);
      if (error !== null) {
        this.setState({
          ...this.state,
          item: { ...this.state.item, errors: { error }, level: FetchLevel.failure },
        });

        return;
      }

      this.setState({
        ...this.state,
        item: { ...this.state.item, level: FetchLevel.success, data: item },
      });
    })();
  }
}
