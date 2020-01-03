import React from "react";

import { Callout, Classes, H5, HTMLTable, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import {
  IExpansion,
  IItemsMap,
  IPricelistEntryJson,
  IPricelistJson,
  IProfession,
  IProfessionPricelistJson,
  IRegion,
  IStatusRealm,
  ItemId,
  ItemQuality,
  ProfessionName,
} from "@sotah-inc/core";

import { ItemPopoverContainer } from "../../../../../../containers/util/ItemPopover";
import { FetchLevel } from "../../../../../../types/main";
import { getItemFromPricelist, qualityToColorClass } from "../../../../../../util";
import { ProfessionIcon } from "../../../../../util";
import { ItemIcon } from "../../../../../util/ItemIcon";

export interface IStateProps {
  unmetDemandItemIds: ItemId[];
  unmetDemandProfessionPricelists: IProfessionPricelistJson[];
  professions: IProfession[];
  getUnmetDemandLevel: FetchLevel;
  items: IItemsMap;
  selectedExpansion: IExpansion | null;
  currentRegion: IRegion | null;
  currentRealm: IStatusRealm | null;
}

export type Props = Readonly<IStateProps>;

interface IState {
  page: number;
}

interface ICollapsedResultItem {
  entry: IPricelistEntryJson;
  professionPricelist: IProfessionPricelistJson;
}

export class UnmetDemand extends React.Component<Props, IState> {
  private static renderProfession(profession: IProfession | null) {
    if (profession === null) {
      return null;
    }

    return (
      <>
        <ProfessionIcon profession={profession} /> {profession.label}
      </>
    );
  }

  public state = {
    page: 0,
  };

  public render() {
    const { selectedExpansion } = this.props;
    const { page } = this.state;

    if (selectedExpansion === null) {
      return null;
    }

    return (
      <>
        <H5>Unmet Demand for {selectedExpansion.label} Professions</H5>
        <button type="button" onClick={() => this.setState({ ...this.state, page: page + 1 })}>
          Clicky
        </button>
        {this.renderUnmetDemandContent()}
      </>
    );
  }

  public onPricelistClick(pricelist: IPricelistJson, professionName: ProfessionName) {
    const { professions } = this.props;

    const profession: IProfession = professions.reduce((currentValue, v) => {
      if (v.name === professionName) {
        return v;
      }

      return currentValue;
    }, professions[0]);

    // tslint:disable-next-line:no-console
    console.log("RealmSummaryPanel.onPricelistClick()", profession, pricelist);
  }

  private renderUnmetDemandContent() {
    const { getUnmetDemandLevel } = this.props;

    switch (getUnmetDemandLevel) {
      case FetchLevel.success:
        return this.renderUnmetDemandSuccess();
      default:
        return (
          <NonIdealState
            title="Loading"
            icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
          />
        );
    }
  }

  private renderUnmetDemandSuccess() {
    const {
      currentRealm,
      currentRegion,
      unmetDemandProfessionPricelists,
      unmetDemandItemIds,
      items,
    } = this.props;
    const { page } = this.state;

    if (currentRealm === null || currentRegion === null) {
      return null;
    }

    let collapsedResult: ICollapsedResultItem[] = unmetDemandProfessionPricelists.reduce(
      (outer: ICollapsedResultItem[], professionPricelist) => [
        ...outer,
        ...professionPricelist.pricelist!.pricelist_entries!.reduce(
          (inner: ICollapsedResultItem[], entry) => [...inner, { professionPricelist, entry }],
          [],
        ),
      ],
      [],
    );
    collapsedResult = collapsedResult.filter(v => unmetDemandItemIds.indexOf(v.entry.item_id) > -1);
    collapsedResult = collapsedResult.sort((a, b) => {
      if (a.professionPricelist.name !== b.professionPricelist.name) {
        return a.professionPricelist.name > b.professionPricelist.name ? 1 : -1;
      }

      if (a.professionPricelist.pricelist!.name !== b.professionPricelist.pricelist!.name) {
        return a.professionPricelist.pricelist!.name > b.professionPricelist.pricelist!.name
          ? 1
          : -1;
      }

      const aItemValue: string =
        a.entry.item_id in items ? items[a.entry.item_id]!.name : a.entry.item_id.toString();
      const bItemValue: string =
        b.entry.item_id in items ? items[b.entry.item_id]!.name : b.entry.item_id.toString();
      if (aItemValue !== bItemValue) {
        return aItemValue > bItemValue ? 1 : -1;
      }

      return 0;
    });

    if (collapsedResult.length === 0) {
      return (
        <Callout intent={Intent.SUCCESS}>
          All pricelists are fulfilled for {currentRegion.name.toUpperCase()}-{currentRealm.name}!
        </Callout>
      );
    }

    const perPage = 10;
    const groupedCollapsedResults: ICollapsedResultItem[][] = collapsedResult.reduce<
      ICollapsedResultItem[][]
    >((grouped, resultItem, i) => {
      const currentPage = (i - (i % perPage)) / perPage;
      if (Object.keys(grouped).indexOf(currentPage.toString()) === -1) {
        grouped[currentPage] = [];
      }

      grouped[currentPage].push(resultItem);

      return grouped;
    }, []);
    const foundCollapsedResults: ICollapsedResultItem[] | undefined = groupedCollapsedResults[page];
    if (typeof foundCollapsedResults === "undefined") {
      return null;
    }

    return (
      <>
        <Callout intent={Intent.PRIMARY}>
          These items have <strong>0</strong> auctions posted on {currentRegion.name.toUpperCase()}-
          {currentRealm.name}.
        </Callout>
        {this.renderResultsTable(foundCollapsedResults)}
      </>
    );
  }

  private renderResultsTable(collapsedResult: ICollapsedResultItem[]) {
    const classNames = [
      Classes.HTML_TABLE,
      Classes.HTML_TABLE_BORDERED,
      Classes.SMALL,
      "unmet-items-table",
    ];

    return (
      <HTMLTable className={classNames.join(" ")}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Profession</th>
            <th>Pricelist</th>
          </tr>
        </thead>
        <tbody>{collapsedResult.map((v, i) => this.renderItemRow(i, v))}</tbody>
      </HTMLTable>
    );
  }

  private renderItemRow(index: number, resultItem: ICollapsedResultItem) {
    const { items, professions } = this.props;

    const { professionPricelist, entry } = resultItem;
    const profession: IProfession | null = professions.reduce(
      (currentValue: IProfession | null, v) => {
        if (currentValue !== null) {
          return currentValue;
        }

        return v.name === professionPricelist.name ? v : null;
      },
      null,
    );
    const { item_id } = entry;
    const item = items[item_id];

    if (typeof item === "undefined") {
      return (
        <tr key={index}>
          <td className={qualityToColorClass(ItemQuality.Common)}>{item_id}</td>
          <td>{UnmetDemand.renderProfession(profession)}</td>
          <td>
            {this.renderPricelistCell(professionPricelist.pricelist!, professionPricelist.name)}
          </td>
        </tr>
      );
    }

    return (
      <tr key={index}>
        <td className={qualityToColorClass(item.quality)}>
          <ItemPopoverContainer item={item} />
        </td>
        <td>{UnmetDemand.renderProfession(profession)}</td>
        <td>
          {this.renderPricelistCell(professionPricelist.pricelist!, professionPricelist.name)}
        </td>
      </tr>
    );
  }

  private renderPricelistCell(pricelist: IPricelistJson, profession: ProfessionName) {
    return (
      <>
        {this.renderPricelistIcon(pricelist)}
        &nbsp;
        <a onClick={() => this.onPricelistClick(pricelist, profession)}>{pricelist.name}</a>
      </>
    );
  }

  private renderPricelistIcon(list: IPricelistJson) {
    const { items } = this.props;

    const item = getItemFromPricelist(items, list);
    if (item === null) {
      return null;
    }

    return <ItemIcon item={item} />;
  }
}
