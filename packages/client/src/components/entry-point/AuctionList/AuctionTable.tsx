import { Button, ButtonGroup, Classes, HTMLTable } from "@blueprintjs/core";
import {
  IAuction,
  IExpansion,
  IItem,
  IPricelistJson,
  IProfession,
  IProfessionPricelistJson,
  IQueryAuctionsItem,
  IRegion,
  IStatusRealm,
  ItemQuality,
  SortKind,
} from "@sotah-inc/core";
import React from "react";

import { SortToggleContainer } from "../../../containers/entry-point/AuctionList/SortToggle";
import { ItemPopoverContainer } from "../../../containers/util/ItemPopover";
import { IItemsData } from "../../../types/global";
import { getItemFromPricelist, getSelectedResultIndex, qualityToColorClass } from "../../../util";
import { Currency, ProfessionIcon } from "../../util";
import { ItemIcon } from "../../util/ItemIcon";

type ListAuction = IAuction | null;

export interface IStateProps {
  auctions: IItemsData<ListAuction[]>;
  selectedItems: IQueryAuctionsItem[];
  relatedProfessionPricelists: IProfessionPricelistJson[];
  expansions: IExpansion[];
  professions: IProfession[];
  currentRealm: IStatusRealm | null;
  currentRegion: IRegion | null;
}

export interface IDispatchProps {
  onAuctionsQuerySelect: (aqResult: IQueryAuctionsItem) => void;
  onAuctionsQueryDeselect: (index: number) => void;
}

export interface IRouteProps {
  browseToProfessionPricelist: (
    region: IRegion,
    realm: IStatusRealm,
    profession: IProfession,
    expansion: IExpansion,
    pricelist: IPricelistJson,
  ) => void;
}

export type IOwnProps = IRouteProps;

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class AuctionTable extends React.Component<Props> {
  public isResultSelected(result: IQueryAuctionsItem) {
    return this.getSelectedResultIndex(result) > -1;
  }

  public getSelectedResultIndex(result: IQueryAuctionsItem): number {
    const selectedItems = this.props.selectedItems;
    return getSelectedResultIndex(result, selectedItems);
  }

  public onItemClick(item: IItem) {
    const result: IQueryAuctionsItem = {
      item,
      rank: 0,
      target: "",
    };

    if (this.isResultSelected(result)) {
      this.props.onAuctionsQueryDeselect(this.getSelectedResultIndex(result));

      return;
    }

    this.props.onAuctionsQuerySelect(result);
  }

  public renderItemPopover(item: IItem) {
    return <ItemPopoverContainer item={item} onItemClick={() => this.onItemClick(item)} />;
  }

  public renderAuction(auction: IAuction | null, index: number) {
    const { auctions } = this.props;

    if (auction === null || !(auction.itemId in auctions.items)) {
      return (
        <tr key={index}>
          <td>---</td>
          <td>---</td>
          <td>---</td>
          <td>---</td>
          <td>---</td>
          <td>---</td>
        </tr>
      );
    }

    const item = auctions.items[auction.itemId];

    return (
      <React.Fragment key={index}>
        <tr>
          {this.renderItemCell(auction.itemId, item)}
          <td className="quantity-container">{auction.quantity}</td>
          <td className="currency-container">
            <Currency amount={auction.buyout} hideCopper={true} />
          </td>
          <td className="buyout-container">
            <Currency amount={auction.buyoutPer} hideCopper={true} />
          </td>
          <td className="auclist-container">{auction.aucList.length}</td>
        </tr>
        {this.renderRelatedProfessionPricelists(item)}
      </React.Fragment>
    );
  }

  public renderItemCell(itemId: number, item: IItem | undefined) {
    if (typeof item === "undefined") {
      return <td className={qualityToColorClass(ItemQuality.Common)}>{itemId}</td>;
    }

    return <td className={qualityToColorClass(item.quality)}>{this.renderItemPopover(item)}</td>;
  }

  public render() {
    const { auctions } = this.props;

    const classNames = [
      Classes.HTML_TABLE,
      Classes.HTML_TABLE_BORDERED,
      Classes.SMALL,
      "auction-table",
    ];

    return (
      <HTMLTable className={classNames.join(" ")}>
        <thead>
          <tr>
            <th>
              <SortToggleContainer label="Item" sortKind={SortKind.item} />
            </th>
            <th>
              <SortToggleContainer label="Quantity" sortKind={SortKind.quantity} />
            </th>
            <th>
              <SortToggleContainer label="Buyout" sortKind={SortKind.buyout} />
            </th>
            <th>
              <SortToggleContainer label="BuyoutPer" sortKind={SortKind.buyoutPer} />
            </th>
            <th>
              <SortToggleContainer label="Auctions" sortKind={SortKind.auctions} />
            </th>
          </tr>
        </thead>
        <tbody>{auctions.data.map((auction, index) => this.renderAuction(auction, index))}</tbody>
      </HTMLTable>
    );
  }

  private renderRelatedProfessionPricelists(item: IItem | undefined) {
    const { relatedProfessionPricelists } = this.props;

    if (typeof item === "undefined") {
      return null;
    }

    const forItem = relatedProfessionPricelists.filter(
      v => v.pricelist.pricelist_entries.filter(y => y.item_id === item.id).length > 0,
    );
    if (forItem.length === 0) {
      return null;
    }

    return forItem.map((v, i) => this.renderProfessionPricelist(i, v));
  }

  private renderPricelistIcon(list: IPricelistJson) {
    const {
      auctions: { items },
    } = this.props;

    const item = getItemFromPricelist(items, list);
    if (item === null) {
      return null;
    }

    return <ItemIcon item={item} />;
  }

  private renderProfessionPricelist(index: number, professionPricelist: IProfessionPricelistJson) {
    const {
      expansions,
      professions,
      currentRegion,
      currentRealm,
      browseToProfessionPricelist,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return null;
    }

    const expansion = expansions.reduce<IExpansion | null>((prev, v) => {
      if (prev !== null) {
        return prev;
      }

      if (v.name === professionPricelist.expansion) {
        return v;
      }

      return null;
    }, null);
    if (expansion === null) {
      return null;
    }

    const profession = professions.reduce<IProfession | null>((prev, v) => {
      if (prev !== null) {
        return prev;
      }

      if (v.name === professionPricelist.name) {
        return v;
      }

      return null;
    }, null);
    if (profession === null) {
      return null;
    }

    const boxShadow: string = index === 0 ? "none" : "inset 0 1px 0 0 rgba(255, 255, 255, 0.15)";

    return (
      <tr className="related-profession-pricelists" key={index}>
        <td colSpan={3} style={{ boxShadow }}>
          <ButtonGroup>
            <Button
              rightIcon="chevron-right"
              minimal={true}
              small={true}
              onClick={() =>
                browseToProfessionPricelist(
                  currentRegion,
                  currentRealm,
                  profession,
                  expansion,
                  professionPricelist.pricelist,
                )
              }
            >
              <ProfessionIcon profession={profession} /> {profession.label}
            </Button>
            <Button
              rightIcon="chevron-right"
              minimal={true}
              small={true}
              onClick={() =>
                browseToProfessionPricelist(
                  currentRegion,
                  currentRealm,
                  profession,
                  expansion,
                  professionPricelist.pricelist,
                )
              }
            >
              <span style={{ color: expansion.label_color }}>{expansion.label}</span>
            </Button>
            <Button
              icon={this.renderPricelistIcon(professionPricelist.pricelist)}
              minimal={true}
              small={true}
              onClick={() =>
                browseToProfessionPricelist(
                  currentRegion,
                  currentRealm,
                  profession,
                  expansion,
                  professionPricelist.pricelist,
                )
              }
            >
              {professionPricelist.pricelist.name}
            </Button>
          </ButtonGroup>
        </td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
        <td style={{ boxShadow: "inset 1px 0 0 0 rgba(255, 255, 255, 0.15)" }}>&nbsp;</td>
      </tr>
    );
  }
}
