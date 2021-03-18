import React from "react";

import { Classes, HTMLTable } from "@blueprintjs/core";
import {
  IAuction,
  IExpansion,
  IGetItemsRecipesResponseData,
  IProfessionPricelistJson,
  IRegionComposite,
  IShortItem,
  IShortPet,
  IShortProfession,
  ItemQuality,
  PetId,
  PetQuality,
  SortKind,
  SortPerPage,
} from "@sotah-inc/core";

import { SortToggleContainer } from "../../../containers/entry-point/AuctionList/SortToggle";
import { ItemPopoverContainer } from "../../../containers/util/ItemPopover";
import {
  RelatedProfessionPricelistsRouteContainer,
} from "../../../route-containers/entry-point/AuctionList/AuctionTable/RelatedProfessionPricelists";
import { IAuctionResultData, IAuctionsOptions } from "../../../types/auction";
import { IClientRealm } from "../../../types/global";
import { petQualityToColorClass, qualityToColorClass } from "../../../util";
import { Currency } from "../../util";
import { PetPopover } from "../../util/PetPopover";

export interface IStateProps {
  auctionsResultData: IAuctionResultData;
  relatedProfessionPricelists: IProfessionPricelistJson[];
  options: IAuctionsOptions;
  expansions: IExpansion[];
  professions: IShortProfession[];
  currentRealm: IClientRealm | null;
  currentRegion: IRegionComposite | null;
  totalResults: number;
  itemsRecipes: IGetItemsRecipesResponseData;
}

export interface IDispatchProps {
  selectItemQueryAuctions: (item: IShortItem) => void;
  selectPetQueryAuctions: (pet: IShortPet) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class AuctionTable extends React.Component<Props> {
  public renderItemPopover(item: IShortItem): JSX.Element {
    const { selectItemQueryAuctions } = this.props;

    return <ItemPopoverContainer item={item} onItemClick={() => selectItemQueryAuctions(item)} />;
  }

  public renderPetPopover(pet: IShortPet, quality: PetQuality, level: number): JSX.Element {
    const { selectPetQueryAuctions } = this.props;

    return (
      <PetPopover
        pet={pet}
        quality={quality}
        onPetClick={() => selectPetQueryAuctions(pet)}
        level={level}
      />
    );
  }

  public renderAuction(auction: IAuction | null, index: number): JSX.Element {
    const renderedCell = auction ? this.renderTargetCell(auction) : null;
    if (auction === null || renderedCell === null) {
      return (
        <tr key={index}>
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
          {renderedCell}
          <td className="quantity-container">{auction.quantity}</td>
          <td className="currency-container">
            <Currency amount={auction.buyout} hideCopper={true} />
            {this.renderMarketPricePercentage(auction)}
          </td>
          <td className="auclist-container">{auction.aucList.length}</td>
          <td>{auction.timeLeft}</td>
        </tr>
        {this.renderSecondaryRow(auction)}
      </React.Fragment>
    );
  }

  public renderMarketPricePercentage(auction: IAuction): JSX.Element | null {
    const {
      auctionsResultData: { items_market_price },
    } = this.props;

    const found = items_market_price.find(v => v.id === auction.itemId);
    if (found === undefined) {
      return null;
    }

    const percentage = (auction.buyoutPer / found.market_price) * 100;
    const colorClass = ((): string => {
      if (percentage < 80) {
        return "uncommon-text";
      }

      if (percentage > 120) {
        return "epic-text";
      }

      return "poor-text";
    })();

    return <span className={colorClass}> ({Number(percentage.toFixed(0)).toLocaleString()}%)</span>;
  }

  public renderTargetCell(auction: IAuction): JSX.Element | null {
    const { auctionsResultData } = this.props;

    const foundPet = auctionsResultData.pets.find(v => v.id === auction.pet_species_id);
    if (foundPet) {
      return this.renderPetCell(
        auction.pet_species_id,
        foundPet,
        auction.pet_quality_id,
        auction.pet_level,
      );
    }

    const foundItem = auctionsResultData.items.find(v => v.id === auction.itemId);
    if (foundItem) {
      return this.renderItemCell(auction.itemId, foundItem);
    }

    return null;
  }

  public renderItemCell(itemId: number, item: IShortItem | undefined): JSX.Element {
    if (typeof item === "undefined") {
      return <td className={qualityToColorClass(ItemQuality.Common)}>{itemId}</td>;
    }

    return (
      <td className={qualityToColorClass(item.quality.type)}>{this.renderItemPopover(item)}</td>
    );
  }

  public renderPetCell(
    petId: PetId,
    pet: IShortPet | undefined,
    quality: PetQuality,
    level: number,
  ): JSX.Element {
    if (typeof pet === "undefined") {
      return <td className={petQualityToColorClass(quality)}>{petId}</td>;
    }

    return (
      <td className={petQualityToColorClass(quality)}>
        {this.renderPetPopover(pet, quality, level)}
      </td>
    );
  }

  public render(): React.ReactNode {
    const { auctionsResultData, totalResults, options } = this.props;

    const classNames = [
      Classes.HTML_TABLE,
      Classes.HTML_TABLE_BORDERED,
      Classes.SMALL,
      "auction-table",
    ];

    const auctions: Array<IAuction | null> = [...auctionsResultData.auctions];
    if (totalResults > 0) {
      if (
        options.auctionsPerPage === SortPerPage.Ten &&
        auctions.length < options.auctionsPerPage
      ) {
        for (let i = auctions.length; i < options.auctionsPerPage; i++) {
          auctions[i] = null;
        }
      }
    }

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
              <SortToggleContainer label="Auctions" sortKind={SortKind.auctions} />
            </th>
            <th>Time left</th>
          </tr>
        </thead>
        <tbody>{auctions.map((auction, index) => this.renderAuction(auction, index))}</tbody>
      </HTMLTable>
    );
  }

  private renderSecondaryRow(auction: IAuction) {
    const { auctionsResultData } = this.props;

    const foundItem = auctionsResultData.items.find(v => v.id === auction?.itemId);
    if (!foundItem) {
      return null;
    }

    return this.renderRelatedProfessionPricelists(foundItem);
  }

  private renderRelatedProfessionPricelists(item: IShortItem) {
    const { relatedProfessionPricelists } = this.props;

    const forItem = relatedProfessionPricelists.filter(
      v => v.pricelist.pricelist_entries.filter(y => y.item_id === item.id).length > 0,
    );
    if (forItem.length === 0) {
      return null;
    }

    return <RelatedProfessionPricelistsRouteContainer professionPricelists={forItem} />;
  }
}
