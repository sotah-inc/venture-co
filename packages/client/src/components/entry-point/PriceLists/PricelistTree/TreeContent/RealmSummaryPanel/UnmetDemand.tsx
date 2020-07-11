import React from "react";

import {
  Alignment,
  Callout,
  Classes,
  H5,
  HTMLTable,
  Intent,
  Navbar,
  NavbarGroup,
  NonIdealState,
  Spinner,
} from "@blueprintjs/core";
import {
  IExpansion,
  IItemsMap,
  IPricelistEntryJson,
  IPricelistJson,
  IProfession,
  IProfessionPricelistJson,
  IRegionComposite,
  ItemId,
  ItemQuality,
  ProfessionName,
} from "@sotah-inc/core";

import { ItemPopoverContainer } from "../../../../../../containers/util/ItemPopover";
import { IClientRealm } from "../../../../../../types/global";
import { FetchLevel } from "../../../../../../types/main";
import { getItemFromPricelist, qualityToColorClass } from "../../../../../../util";
import { Pagination, ProfessionIcon } from "../../../../../util";
import { ItemIcon } from "../../../../../util/ItemIcon";

export interface IStateProps {
  unmetDemandItemIds: ItemId[];
  unmetDemandProfessionPricelists: IProfessionPricelistJson[];
  professions: IProfession[];
  getUnmetDemandLevel: FetchLevel;
  items: IItemsMap;
  selectedExpansion: IExpansion | null;
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
}

export interface IRouteProps {
  browseToProfessionPricelist: (
    region: IRegionComposite,
    realm: IStatusRealm,
    expansion: IExpansion,
    profession: IProfession,
    pricelist: IPricelistJson,
  ) => void;
}

export type Props = Readonly<IStateProps & IRouteProps>;

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

    if (selectedExpansion === null) {
      return null;
    }

    return (
      <>
        <H5>
          Unmet Demand for{" "}
          <span style={{ color: selectedExpansion.label_color }}>{selectedExpansion.label}</span>{" "}
          Professions
        </H5>
        {this.renderUnmetDemandContent()}
      </>
    );
  }

  public onPricelistClick(pricelist: IPricelistJson, professionName: ProfessionName) {
    const {
      browseToProfessionPricelist,
      professions,
      currentRegion,
      currentRealm,
      selectedExpansion,
    } = this.props;

    if (currentRegion === null || currentRealm === null || selectedExpansion === null) {
      return;
    }

    const profession = professions.reduce<IProfession | null>((currentValue, v) => {
      if (currentValue !== null) {
        return currentValue;
      }

      if (v.name === professionName) {
        return v;
      }

      return currentValue;
    }, null);

    if (profession === null) {
      return;
    }

    browseToProfessionPricelist(
      currentRegion,
      currentRealm,
      selectedExpansion,
      profession,
      pricelist,
    );
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
        a.entry.item_id in items
          ? items[a.entry.item_id]!.blizzard_meta.preview_item.name.en_US!
          : a.entry.item_id.toString();
      const bItemValue: string =
        b.entry.item_id in items
          ? items[b.entry.item_id]!.blizzard_meta.preview_item.name.en_US!
          : b.entry.item_id.toString();
      if (aItemValue !== bItemValue) {
        return aItemValue > bItemValue ? 1 : -1;
      }

      return 0;
    });

    if (collapsedResult.length === 0) {
      return (
        <Callout intent={Intent.SUCCESS}>
          All pricelists are fulfilled for {currentRegion.config_region.name.toUpperCase()}-
          {currentRealm.realm.name}!
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
        <Callout intent={Intent.PRIMARY} style={{ marginBottom: "10px" }}>
          These items have <strong>0</strong> auctions posted on{" "}
          {currentRegion.config_region.name.toUpperCase()}-{currentRealm.realm.name}.
        </Callout>
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <Pagination
              pageCount={groupedCollapsedResults.length - 1}
              currentPage={page}
              pagesShown={5}
              onPageChange={pageTarget => this.setState({ page: pageTarget })}
            />
          </NavbarGroup>
        </Navbar>
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
        <td className={qualityToColorClass(item.blizzard_meta.quality.type)}>
          <ItemPopoverContainer interactive={false} item={item} />
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
