import React from "react";

import { Button, ButtonGroup, Classes, HTMLTable } from "@blueprintjs/core";
import {
  IAuction,
  IExpansion,
  IItem,
  IItemsMap,
  IPricelistJson,
  IProfession,
  IProfessionPricelistJson,
  IQueryAuctionsItem,
  IRegion,
  IStatusRealm,
  ItemId,
  SortKind,
} from "@sotah-inc/core";

import { SortToggleContainer } from "../../../../containers/App/Data/AuctionList/SortToggle";
import { ItemPopoverContainer } from "../../../../containers/util/ItemPopover";
import { PricelistIconContainer } from "../../../../containers/util/PricelistIcon";
import { getSelectedResultIndex, qualityToColorClass } from "../../../../util";
import { Currency, ProfessionIcon } from "../../../util";

type ListAuction = IAuction | null;

export interface IStateProps {
  auctions: ListAuction[];
  selectedItems: IQueryAuctionsItem[];
  items: IItemsMap;
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
      owner: null,
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
    const { items } = this.props;

    if (auction === null || !(auction.itemId in items)) {
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

    const item = items[auction.itemId];

    return (
      <React.Fragment key={index}>
        <tr>
          <td className={qualityToColorClass(item.quality)}>{this.renderItemPopover(item)}</td>
          <td className="quantity-container">{auction.quantity}</td>
          <td className="currency-container">
            <Currency amount={auction.buyout} hideCopper={true} />
          </td>
          <td className="buyout-container">
            <Currency amount={auction.buyoutPer} hideCopper={true} />
          </td>
          <td className="auclist-container">{auction.aucList.length}</td>
          <td className="owner-container">{auction.owner}</td>
        </tr>
        {this.renderRelatedProfessionPricelists(item.id)}
      </React.Fragment>
    );
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
            <th>
              <SortToggleContainer label="Owner" sortKind={SortKind.owner} />
            </th>
          </tr>
        </thead>
        <tbody>{auctions.map((auction, index) => this.renderAuction(auction, index))}</tbody>
      </HTMLTable>
    );
  }

  private renderRelatedProfessionPricelists(itemId: ItemId) {
    const { relatedProfessionPricelists } = this.props;

    const forItem = relatedProfessionPricelists.filter(
      v => v.pricelist.pricelist_entries.filter(y => y.item_id === itemId).length > 0,
    );
    if (forItem.length === 0) {
      return null;
    }

    return forItem.map((v, i) => this.renderProfessionPricelist(i, v));
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
              icon={<PricelistIconContainer pricelist={professionPricelist.pricelist} />}
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
