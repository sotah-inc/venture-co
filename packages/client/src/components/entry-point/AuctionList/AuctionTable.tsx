import { Button, ButtonGroup, Classes, HTMLTable } from "@blueprintjs/core";
import {
  IAuction,
  IExpansion,
  IPricelistJson,
  IProfession,
  IProfessionPricelistJson,
  IRegionComposite,
  IShortItem,
  ItemQuality,
  SortKind,
} from "@sotah-inc/core";
import React from "react";

import { SortToggleContainer } from "../../../containers/entry-point/AuctionList/SortToggle";
import { ItemPopoverContainer } from "../../../containers/util/ItemPopover";
import { IClientRealm, IItemsData } from "../../../types/global";
import { getItemFromPricelist, qualityToColorClass } from "../../../util";
import { Currency, ProfessionIcon } from "../../util";
import { ItemIcon } from "../../util/ItemIcon";

type ListAuction = IAuction | null;

export interface IStateProps {
  auctions: IItemsData<ListAuction[]>;
  relatedProfessionPricelists: IProfessionPricelistJson[];
  expansions: IExpansion[];
  professions: IProfession[];
  currentRealm: IClientRealm | null;
  currentRegion: IRegionComposite | null;
}

export interface IDispatchProps {
  selectItemQueryAuctions: (item: IShortItem) => void;
}

export interface IRouteProps {
  browseToExpansion: (region: IRegionComposite, realm: IClientRealm, expansion: IExpansion) => void;
  browseToProfession: (
    region: IRegionComposite,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IProfession,
  ) => void;
  browseToProfessionPricelist: (
    region: IRegionComposite,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IProfession,
    pricelist: IPricelistJson,
  ) => void;
}

export type IOwnProps = IRouteProps;

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class AuctionTable extends React.Component<Props> {
  public renderItemPopover(item: IShortItem) {
    const { selectItemQueryAuctions } = this.props;

    return <ItemPopoverContainer item={item} onItemClick={() => selectItemQueryAuctions(item)} />;
  }

  public renderAuction(auction: IAuction | null, index: number) {
    const { auctions } = this.props;

    const foundItem = auctions.items.find(v => v.id === auction?.itemId);
    if (auction === null || !foundItem) {
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

    return (
      <React.Fragment key={index}>
        <tr>
          {this.renderItemCell(auction.itemId, foundItem)}
          <td className="quantity-container">{auction.quantity}</td>
          <td className="currency-container">
            <Currency amount={auction.buyout} hideCopper={true} />
          </td>
          <td className="buyout-container">
            <Currency amount={auction.buyoutPer} hideCopper={true} />
          </td>
          <td className="auclist-container">{auction.aucList.length}</td>
          <td>{auction.timeLeft}</td>
        </tr>
        {this.renderRelatedProfessionPricelists(foundItem)}
      </React.Fragment>
    );
  }

  public renderItemCell(itemId: number, item: IShortItem | undefined) {
    if (typeof item === "undefined") {
      return <td className={qualityToColorClass(ItemQuality.Common)}>{itemId}</td>;
    }

    return (
      <td className={qualityToColorClass(item.quality.type)}>{this.renderItemPopover(item)}</td>
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
            <th>Time left</th>
          </tr>
        </thead>
        <tbody>{auctions.data.map((auction, index) => this.renderAuction(auction, index))}</tbody>
      </HTMLTable>
    );
  }

  private renderRelatedProfessionPricelists(item: IShortItem | undefined) {
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
      browseToExpansion,
      browseToProfession,
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
              onClick={() => browseToExpansion(currentRegion, currentRealm, expansion)}
            >
              <span style={{ color: expansion.label_color }}>{expansion.label}</span>
            </Button>
            <Button
              rightIcon="chevron-right"
              minimal={true}
              small={true}
              onClick={() => browseToProfession(currentRegion, currentRealm, expansion, profession)}
            >
              <ProfessionIcon profession={profession} /> {profession.label}
            </Button>
            <Button
              icon={this.renderPricelistIcon(professionPricelist.pricelist)}
              minimal={true}
              small={true}
              onClick={() =>
                browseToProfessionPricelist(
                  currentRegion,
                  currentRealm,
                  expansion,
                  profession,
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
