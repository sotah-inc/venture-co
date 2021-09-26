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
  IConfigRegion,
  IExpansion,
  IGetRegionResponseData,
  IPricelistEntryJson,
  IPricelistJson,
  IProfessionPricelistJson,
  IShortProfession,
  ItemQuality,
  ProfessionId,
} from "@sotah-inc/core";

import { ItemPopoverContainer } from "../../../../../../containers/util/ItemPopover";
import { IClientRealm, IFetchData, IItemsData } from "../../../../../../types/global";
import { FetchLevel } from "../../../../../../types/main";
import { IUnmetDemandState } from "../../../../../../types/price-lists";
import { getItemFromPricelist, qualityToColorClass } from "../../../../../../util";
import { Pagination, ProfessionIcon } from "../../../../../util";
import { ItemIcon } from "../../../../../util/ItemIcon";

export interface IStateProps {
  regionData: IFetchData<IGetRegionResponseData>;
  unmetDemand: IFetchData<IItemsData<IUnmetDemandState>>;
  selectedExpansion: IExpansion | null;
  currentRegion: IConfigRegion | null;
  currentRealm: IClientRealm | null;
}

export interface IRouteProps {
  browseToProfession: (
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
  ) => void;
  browseToProfessionPricelist: (
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
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
  public state = {
    page: 0,
  };

  public render(): React.ReactNode {
    const { selectedExpansion } = this.props;

    if (selectedExpansion === null) {
      return null;
    }

    const expansionLabel = (
      <span style={{ color: selectedExpansion.label_color }}>{selectedExpansion.label}</span>
    );

    return (
      <>
        <H5>Unmet Demand for {expansionLabel} Professions</H5>
        {this.renderUnmetDemandContent()}
      </>
    );
  }

  public onProfessionClick(profession: IShortProfession): void {
    const { browseToProfession, currentRegion, currentRealm, selectedExpansion } = this.props;

    if (currentRegion === null || currentRealm === null || selectedExpansion === null) {
      return;
    }

    browseToProfession(currentRegion, currentRealm, selectedExpansion, profession);
  }

  public onPricelistClick(pricelist: IPricelistJson, professionId: ProfessionId): void {
    const {
      browseToProfessionPricelist,
      regionData,
      currentRegion,
      currentRealm,
      selectedExpansion,
    } = this.props;

    if (currentRegion === null || currentRealm === null || selectedExpansion === null) {
      return;
    }

    const profession = regionData.data.professions.reduce<IShortProfession | null>(
      (currentValue, v) => {
        if (currentValue !== null) {
          return currentValue;
        }

        if (v.id === professionId) {
          return v;
        }

        return currentValue;
      },
      null,
    );

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

  private renderProfession(profession: IShortProfession | null) {
    if (profession === null) {
      return null;
    }

    return (
      <>
        <ProfessionIcon profession={profession} />
        &nbsp;
        <a onClick={() => this.onProfessionClick(profession)}>{profession.name}</a>
      </>
    );
  }

  private renderUnmetDemandContent() {
    const { unmetDemand } = this.props;

    switch (unmetDemand.level) {
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
    const { currentRealm, currentRegion, unmetDemand } = this.props;
    const { page } = this.state;

    if (currentRealm === null || currentRegion === null) {
      return null;
    }

    let collapsedResult: ICollapsedResultItem[] = unmetDemand.data.data.professionPricelists.reduce(
      (outer: ICollapsedResultItem[], professionPricelist) => [
        ...outer,
        ...professionPricelist.pricelist.pricelist_entries.reduce(
          (inner: ICollapsedResultItem[], entry) => [...inner, { professionPricelist, entry }],
          [],
        ),
      ],
      [],
    );
    collapsedResult = collapsedResult.filter(
      v => unmetDemand.data.data.unmetItemIds.indexOf(v.entry.item_id) > -1,
    );
    collapsedResult = collapsedResult.sort((a, b) => {
      if (a.professionPricelist.professionId !== b.professionPricelist.professionId) {
        return a.professionPricelist.professionId > b.professionPricelist.professionId ? 1 : -1;
      }

      if (a.professionPricelist.pricelist.name !== b.professionPricelist.pricelist.name) {
        return a.professionPricelist.pricelist.name > b.professionPricelist.pricelist.name ? 1 : -1;
      }

      const aItemValue: string =
        unmetDemand.data.items.find(v => v.id === a.entry.item_id)?.name ??
        a.entry.item_id.toString();
      const bItemValue: string =
        unmetDemand.data.items.find(v => v.id === b.entry.item_id)?.name ??
        b.entry.item_id.toString();
      if (aItemValue !== bItemValue) {
        return aItemValue > bItemValue ? 1 : -1;
      }

      return 0;
    });

    if (collapsedResult.length === 0) {
      return (
        <Callout intent={Intent.SUCCESS}>
          All pricelists are fulfilled for {currentRegion.name.toUpperCase()}-
          {currentRealm.realm.name.en_US}!
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
          These items have <strong>0</strong> auctions posted on {currentRegion.name.toUpperCase()}-
          {currentRealm.realm.name.en_US}.
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
    const { unmetDemand, regionData } = this.props;

    const { professionPricelist, entry } = resultItem;
    const profession: IShortProfession | null = regionData.data.professions.reduce(
      (currentValue: IShortProfession | null, v) => {
        if (currentValue !== null) {
          return currentValue;
        }

        return v.id === professionPricelist.professionId ? v : null;
      },
      null,
    );
    const { item_id } = entry;
    const item = unmetDemand.data.items.find(v => v.id === item_id);

    if (typeof item === "undefined") {
      return (
        <tr key={index}>
          <td className={qualityToColorClass(ItemQuality.Common)}>{item_id}</td>
          <td>{this.renderProfession(profession)}</td>
          <td>
            {this.renderPricelistCell(
              professionPricelist.pricelist,
              professionPricelist.professionId,
            )}
          </td>
        </tr>
      );
    }

    return (
      <tr key={index}>
        <td className={qualityToColorClass(item.quality.type)}>
          <ItemPopoverContainer interactive={false} item={item} />
        </td>
        <td>{this.renderProfession(profession)}</td>
        <td>
          {this.renderPricelistCell(
            professionPricelist.pricelist,
            professionPricelist.professionId,
          )}
        </td>
      </tr>
    );
  }

  private renderPricelistCell(pricelist: IPricelistJson, professionId: ProfessionId) {
    return (
      <>
        {this.renderPricelistIcon(pricelist)}
        &nbsp;
        <a onClick={() => this.onPricelistClick(pricelist, professionId)}>{pricelist.name}</a>
      </>
    );
  }

  private renderPricelistIcon(list: IPricelistJson) {
    const { unmetDemand } = this.props;

    const item = getItemFromPricelist(unmetDemand.data.items, list);
    if (item === null) {
      return null;
    }

    return <ItemIcon item={item} />;
  }
}
