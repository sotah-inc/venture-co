import React from "react";

import { Classes, Intent, TreeNodeInfo, Spinner, Tree } from "@blueprintjs/core";
import {
  IExpansion,
  IPricelistJson,
  IProfessionPricelistJson,
  IConfigRegion,
  IShortProfession,
  GameVersion,
} from "@sotah-inc/core";

import { TreeContentContainer } from "../../../containers/entry-point/PriceLists/PricelistTree/TreeContent";
import { IClientRealm, IFetchData, IItemsData } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { getItemFromPricelist } from "../../../util";
import { ProfessionIcon } from "../../util";
import { ItemIcon } from "../../util/ItemIcon";

export interface IStateProps {
  currentGameVersion: GameVersion | null;
  currentRegion: IConfigRegion | null;
  currentRealm: IClientRealm | null;
  selectedProfession: IShortProfession | null;
  selectedExpansion: IExpansion | null;
  selectedList: IPricelistJson | null;

  professionPricelists: IFetchData<IItemsData<IProfessionPricelistJson[]>>;
}

export interface IRouteProps {
  browseToExpansion: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
  ) => void;
  browseToProfessionPricelist: (
    gameVersion: GameVersion,
    region: IConfigRegion,
    realm: IClientRealm,
    expansion: IExpansion,
    profession: IShortProfession,
    pricelist: IPricelistJson,
  ) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IRouteProps>;

interface ITopOpenMap {
  [key: string]: boolean;
}

interface INodeClickMap {
  [key: string]: (v: string) => void;
}

interface IState {
  topOpenMap: ITopOpenMap;
}

enum TopOpenKey {
  summary = "summary",
  professions = "professions",
}

export class PricelistTree extends React.Component<Props, IState> {
  public state: IState = {
    topOpenMap: {
      [TopOpenKey.professions]: true,
    },
  };

  public render(): React.ReactNode {
    const { currentRealm, currentRegion, selectedProfession } = this.props;
    const { topOpenMap } = this.state;

    const nodes: TreeNodeInfo[] = [];
    if (currentRegion !== null && currentRealm !== null) {
      nodes.push({
        id: "top-summary",
        isSelected: this.isSummarySelected(),
        label: `${currentRegion.name.toUpperCase()}-${currentRealm.realm.name.en_US} Summary`,
      });
    }

    // appending profession-pricelists
    nodes.push({
      childNodes: this.getProfessionPricelistNodes(),
      hasCaret: true,
      icon:
        selectedProfession === null ? "list" : <ProfessionIcon profession={selectedProfession} />,
      id: `top-${TopOpenKey.professions}`,
      isExpanded: topOpenMap[TopOpenKey.professions],
      label:
        selectedProfession === null
          ? "Profession Pricelists"
          : `${selectedProfession.name} Pricelists`,
    });

    return (
      <div style={{ marginTop: "10px" }}>
        <div className="pure-g">
          <div className="pure-u-1-4 pricelist-tree">
            <Tree
              contents={nodes}
              className={Classes.ELEVATION_0}
              onNodeClick={v => this.onNodeClick(v)}
              onNodeExpand={v => this.onNodeClick(v)}
              onNodeCollapse={v => this.onNodeClick(v)}
            />
          </div>
          <div className="pure-u-3-4">
            <div style={{ paddingLeft: "10px" }}>
              <TreeContentContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private isSummarySelected() {
    const { selectedList, selectedProfession } = this.props;

    return selectedList === null && selectedProfession === null;
  }

  private getProfessionPricelistNodes(): TreeNodeInfo[] {
    const { professionPricelists } = this.props;

    switch (professionPricelists.level) {
    case FetchLevel.success:
      break;
    case FetchLevel.initial:
      return [
        {
          icon: <Spinner size={20} value={0} intent={Intent.NONE} />,
          id: "loading-0",
          label: <span style={{ marginLeft: "5px" }}>Loading</span>,
        },
      ];
    case FetchLevel.failure:
      return [
        {
          icon: <Spinner size={20} intent={Intent.DANGER} value={1} />,
          id: "loading-0",
          label: <span style={{ marginLeft: "5px" }}>Failed to load profession pricelists!</span>,
        },
      ];
    default:
    case FetchLevel.fetching:
      return [
        {
          icon: <Spinner size={20} intent={Intent.PRIMARY} />,
          id: "loading-0",
          label: <span style={{ marginLeft: "5px" }}>Loading</span>,
        },
      ];
    }

    if (professionPricelists.data.data.length === 0) {
      return [{ id: "none-none", label: <em>None found.</em> }];
    }

    return professionPricelists.data.data.map(v => this.getPricelistNode(v.pricelist));
  }

  private getPricelistNode(v: IPricelistJson) {
    const { selectedList } = this.props;

    const result: TreeNodeInfo = {
      className: "pricelist-node",
      icon: this.renderPricelistIcon(v),
      id: `pricelist-${v.id}`,
      isSelected: selectedList !== null && selectedList.id === v.id,
      label: v.name,
    };

    return result;
  }

  private renderPricelistIcon(v: IPricelistJson) {
    const {
      professionPricelists: {
        data: { items },
      },
    } = this.props;

    const item = getItemFromPricelist(items, v);
    if (item === null) {
      return null;
    }

    return <ItemIcon item={item} />;
  }

  private onPricelistNodeClick(id: string) {
    const {
      professionPricelists,
      selectedExpansion,
      currentGameVersion,
      currentRegion,
      currentRealm,
      selectedProfession,
      browseToProfessionPricelist,
    } = this.props;

    if (
      currentGameVersion === null ||
      currentRegion === null ||
      currentRealm === null ||
      selectedProfession === null ||
      selectedExpansion === null
    ) {
      return;
    }

    const foundProfessionPricelist = professionPricelists.data.data.find(
      v => v.pricelist.id.toString() === id,
    );
    if (
      typeof foundProfessionPricelist === "undefined" ||
      foundProfessionPricelist.pricelist.slug === null
    ) {
      return;
    }

    browseToProfessionPricelist(
      currentGameVersion,
      currentRegion,
      currentRealm,
      selectedExpansion,
      selectedProfession,
      foundProfessionPricelist.pricelist,
    );
  }

  private onTopNodeClick(id: TopOpenKey) {
    const {
      browseToExpansion,
      currentGameVersion,
      currentRegion,
      currentRealm,
      selectedExpansion,
    } = this.props;
    const { topOpenMap } = this.state;

    if (
      currentGameVersion === null ||
      currentRegion === null ||
      currentRealm === null ||
      selectedExpansion === null
    ) {
      return;
    }

    if (id === TopOpenKey.summary) {
      browseToExpansion(currentGameVersion, currentRegion, currentRealm, selectedExpansion);

      return;
    }

    this.setState({ topOpenMap: { ...topOpenMap, [id]: !topOpenMap[id] } });
  }

  private onNodeClick(node: TreeNodeInfo) {
    const separatorIndex = node.id.toString().indexOf("-");
    if (separatorIndex === -1) {
      return;
    }

    const [kind, id] = [
      node.id.toString().substr(0, separatorIndex),
      node.id.toString().substr(separatorIndex + 1),
    ];
    const nodeClickMap: INodeClickMap = {
      pricelist: (v: string) => this.onPricelistNodeClick(v),
      top: (v: string) => this.onTopNodeClick(v as TopOpenKey),
    };

    if (!(kind in nodeClickMap)) {
      return;
    }

    nodeClickMap[kind](id);
  }
}
