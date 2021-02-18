import React from "react";

import { Button, ButtonGroup, Classes, HTMLTable } from "@blueprintjs/core";
import {
  IAuction,
  IExpansion,
  IPricelistJson,
  IProfession,
  IProfessionPricelistJson,
  IRegionComposite,
  IShortItem,
  IShortPet,
  ItemQuality,
  PetId,
  PetQuality,
  SortKind,
  SortPerPage,
} from "@sotah-inc/core";

import { SortToggleContainer } from "../../../containers/entry-point/AuctionList/SortToggle";
import { ItemPopoverContainer } from "../../../containers/util/ItemPopover";
import { IAuctionsOptions, IAuctionResultData } from "../../../types/auction";
import { IClientRealm } from "../../../types/global";
import { getItemFromPricelist, petQualityToColorClass, qualityToColorClass } from "../../../util";
import { Currency, ProfessionIcon } from "../../util";
import { ItemIcon } from "../../util/ItemIcon";
import { PetPopover } from "../../util/PetPopover";

export interface IStateProps {
  auctionsResultData: IAuctionResultData;
  relatedProfessionPricelists: IProfessionPricelistJson[];
  options: IAuctionsOptions;
  expansions: IExpansion[];
  professions: IProfession[];
  currentRealm: IClientRealm | null;
  currentRegion: IRegionComposite | null;
  totalResults: number;
}

export interface IDispatchProps {
  selectItemQueryAuctions: (item: IShortItem) => void;
  selectPetQueryAuctions: (pet: IShortPet) => void;
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

  public renderPetPopover(pet: IShortPet, quality: PetQuality, level: number) {
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

  public renderAuction(auction: IAuction | null, index: number) {
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

  public renderMarketPricePercentage(auction: IAuction) {
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

  public renderTargetCell(auction: IAuction) {
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

  public renderItemCell(itemId: number, item: IShortItem | undefined) {
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
  ) {
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
    if (foundItem) {
      return this.renderRelatedProfessionPricelists(foundItem);
    }

    return null;
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
      auctionsResultData: { items },
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
