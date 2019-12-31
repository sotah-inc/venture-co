import React from "react";

import { Classes, Intent, ITreeNode, Spinner, Tree } from "@blueprintjs/core";
import {
  IExpansion,
  IItemsMap,
  IPricelistJson,
  IProfession,
  IRegion,
  IStatusRealm,
  ProfessionName,
} from "@sotah-inc/core";

// tslint:disable-next-line:max-line-length
import { TreeContentContainer } from "../../../containers/entry-point/PriceLists/PricelistTree/TreeContent";
import { IProfile } from "../../../types/global";
import { AuthLevel, FetchLevel } from "../../../types/main";
import { IExpansionProfessionPricelistMap } from "../../../types/price-lists";
import { getItemFromPricelist } from "../../../util";
import { ProfessionIcon } from "../../util";
import { ItemIcon } from "../../util/ItemIcon";

export interface IStateProps {
  pricelists: IPricelistJson[];
  items: IItemsMap;
  selectedList: IPricelistJson | null;
  currentRegion: IRegion | null;
  currentRealm: IStatusRealm | null;
  professions: IProfession[];
  selectedProfession: IProfession | null;
  getProfessionPricelistsLevel: FetchLevel;
  professionPricelists: IExpansionProfessionPricelistMap;
  expansions: IExpansion[];
  selectedExpansion: IExpansion | null;
  authLevel: AuthLevel;
  profile: IProfile | null;
  getPricelistsLevel: FetchLevel;
}

export interface IDispatchProps {
  refreshProfessionPricelists: (profession: ProfessionName) => void;
  refreshPricelists: (token: string) => void;
}

export interface IRouteProps {
  browseToUserPricelist: (region: IRegion, realm: IStatusRealm, pricelist: IPricelistJson) => void;
  browseToProfessionPricelist: (
    region: IRegion,
    realm: IStatusRealm,
    profession: IProfession,
    expansion: IExpansion,
    pricelist: IPricelistJson,
  ) => void;
  browseToProfessions: (region: IRegion, realm: IStatusRealm) => void;
  browseToProfession: (region: IRegion, realm: IStatusRealm, profession: IProfession) => void;
  browseToProfessionExpansion: (
    region: IRegion,
    realm: IStatusRealm,
    profession: IProfession,
    expansion: IExpansion,
  ) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IRouteProps>;

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
  pricelists = "pricelists",
  professions = "professions",
}

export class PricelistTree extends React.Component<Props, IState> {
  public state: IState = {
    topOpenMap: {
      [TopOpenKey.pricelists]: true,
      [TopOpenKey.professions]: true,
    },
  };

  public componentDidMount() {
    const { refreshPricelists, profile, getPricelistsLevel } = this.props;

    if (profile === null) {
      return;
    }

    switch (getPricelistsLevel) {
      case FetchLevel.initial:
        refreshPricelists(profile.token);

        return;
      default:
        return;
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      refreshPricelists,
      profile,
      selectedProfession,
      refreshProfessionPricelists,
      getPricelistsLevel,
    } = this.props;

    if (selectedProfession !== null) {
      const shouldRefreshProfessionPricelists =
        prevProps.selectedProfession === null ||
        prevProps.selectedProfession.name !== selectedProfession.name;
      if (shouldRefreshProfessionPricelists) {
        refreshProfessionPricelists(selectedProfession.name);
      }
    }

    if (profile === null) {
      return;
    }

    switch (getPricelistsLevel) {
      case FetchLevel.initial:
        refreshPricelists(profile.token);

        return;
      default:
        return;
    }
  }

  public render() {
    const { authLevel, currentRealm, currentRegion, selectedExpansion } = this.props;
    const { topOpenMap } = this.state;

    const nodes: ITreeNode[] = [];
    if (currentRegion !== null && currentRealm !== null) {
      nodes.push({
        id: `top-summary`,
        isSelected: this.isSummarySelected(),
        label: `${currentRegion.name.toUpperCase()}-${currentRealm!.name} Summary`,
      });
    }

    // optionally appending custom-pricelists
    if (authLevel === AuthLevel.authenticated) {
      nodes.push({
        childNodes: this.getPricelistNodes(),
        hasCaret: true,
        icon: "list",
        id: `top-${TopOpenKey.pricelists}`,
        isExpanded: topOpenMap[TopOpenKey.pricelists],
        label: "Custom Pricelists",
      });
    }

    // appending profession-pricelists
    nodes.push({
      childNodes: this.getProfessionNodes(),
      hasCaret: true,
      icon: "list",
      id: `top-${TopOpenKey.professions}`,
      isExpanded: topOpenMap[TopOpenKey.professions],
      label: selectedExpansion === null ? "Professions" : `${selectedExpansion.label} Professions`,
    });

    return (
      <div style={{ marginTop: "10px" }}>
        <div className="pure-g">
          <div className="pure-u-1-4 pricelist-tree">
            <Tree
              contents={nodes}
              className={Classes.ELEVATION_0}
              onNodeClick={v => this.onNodeClick(v)}
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

  private getProfessionNodes() {
    const { professions } = this.props;

    return professions.map(v => this.getProfessionNode(v));
  }

  private getProfessionNode(v: IProfession) {
    const { selectedProfession, getProfessionPricelistsLevel } = this.props;

    const isSelected = selectedProfession !== null && selectedProfession.name === v.name;
    const result: ITreeNode = {
      className: "profession-node",
      icon: <ProfessionIcon profession={v} />,
      id: `profession-${v.name}`,
      isSelected,
      label: v.label,
    };
    if (!isSelected) {
      return result;
    }

    result.isExpanded = true;
    result.hasCaret = false;

    switch (getProfessionPricelistsLevel) {
      case FetchLevel.initial:
        result.childNodes = [
          {
            icon: <Spinner size={20} value={0} intent={Intent.NONE} />,
            id: "loading-0",
            label: <span style={{ marginLeft: "5px" }}>Loading</span>,
          },
        ];

        break;
      case FetchLevel.fetching:
        result.childNodes = [
          {
            icon: <Spinner size={20} intent={Intent.PRIMARY} />,
            id: "loading-0",
            label: <span style={{ marginLeft: "5px" }}>Loading</span>,
          },
        ];

        break;
      case FetchLevel.failure:
        result.childNodes = [
          {
            icon: <Spinner size={20} intent={Intent.DANGER} value={1} />,
            id: "loading-0",
            label: <span style={{ marginLeft: "5px" }}>Failed to load profession pricelists!</span>,
          },
        ];

        break;
      case FetchLevel.success:
        result.childNodes = this.getProfessionPricelistNodes();

        break;
      default:
        break;
    }

    return result;
  }

  private getProfessionPricelistNodes(): ITreeNode[] {
    const { professionPricelists, selectedExpansion } = this.props;

    if (selectedExpansion === null) {
      return [];
    }

    const result = professionPricelists[selectedExpansion.name];
    if (typeof result === "undefined") {
      return [
        {
          icon: <Spinner size={20} value={0} intent={Intent.NONE} />,
          id: "loading-0",
          label: <span style={{ marginLeft: "5px" }}>Loading</span>,
        },
      ];
    }

    if (result.length === 0) {
      return [{ id: "none-none", label: <em>None found.</em> }];
    }

    const pricelistNodes = result.map(v => this.getPricelistNode(v.pricelist!));
    return pricelistNodes.sort((a, b) => {
      if (a.label === b.label) {
        return 0;
      }

      return a.label > b.label ? 1 : -1;
    });
  }

  private getPricelistNode(v: IPricelistJson) {
    const { selectedList } = this.props;

    const result: ITreeNode = {
      className: "pricelist-node",
      icon: this.renderPricelistIcon(v),
      id: `pricelist-${v.id}`,
      isSelected: selectedList !== null && selectedList.id === v.id,
      label: v.name,
    };

    return result;
  }

  private renderPricelistIcon(v: IPricelistJson) {
    const { items } = this.props;

    const item = getItemFromPricelist(items, v);
    if (item === null) {
      return null;
    }

    return <ItemIcon item={item} />;
  }

  private getPricelistNodes(): ITreeNode[] {
    const { pricelists } = this.props;

    if (pricelists.length === 0) {
      return [{ id: "none-none", label: <em>None found.</em> }];
    }

    return pricelists.map(v => this.getPricelistNode(v));
  }

  private onPricelistNodeClick(id: string) {
    const {
      pricelists,
      professionPricelists,
      selectedExpansion,
      currentRegion,
      currentRealm,
      selectedProfession,
      browseToProfessionPricelist,
      browseToUserPricelist,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    // checking user pricelists first
    const list = pricelists.reduce<IPricelistJson | null>((result, v) => {
      if (result !== null) {
        return result;
      }

      if (v.id.toString() === id) {
        return v;
      }

      return null;
    }, null);
    if (list !== null) {
      if (list.slug === null) {
        return;
      }

      browseToUserPricelist(currentRegion, currentRealm, list);

      return;
    }

    if (selectedProfession === null || selectedExpansion === null) {
      return;
    }

    const expansionProfessionPricelists = professionPricelists[selectedExpansion.name];
    if (typeof expansionProfessionPricelists === "undefined") {
      return;
    }

    const foundProfessionPricelist = expansionProfessionPricelists.reduce<IPricelistJson | null>(
      (previousValue, currentValue) => {
        if (previousValue !== null) {
          return previousValue;
        }

        if (currentValue.pricelist.id.toString() === id) {
          return currentValue.pricelist;
        }

        return null;
      },
      null,
    );
    if (foundProfessionPricelist === null) {
      return;
    }

    if (foundProfessionPricelist.slug === null) {
      return;
    }

    browseToProfessionPricelist(
      currentRegion,
      currentRealm,
      selectedProfession,
      selectedExpansion,
      foundProfessionPricelist,
    );
  }

  private onProfessionNodeClick(id: string) {
    const {
      professions,
      selectedProfession,
      browseToProfessions,
      currentRegion,
      currentRealm,
      browseToProfession,
    } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    const profession = professions.reduce<IProfession | null>((result, v) => {
      if (result !== null) {
        return result;
      }

      if (v.name === id) {
        return v;
      }

      return null;
    }, null);

    if (
      profession === null ||
      (selectedProfession !== null && profession.name === selectedProfession.name)
    ) {
      browseToProfessions(currentRegion, currentRealm);

      return;
    }

    browseToProfession(currentRegion, currentRealm, profession);
  }

  private onTopNodeClick(id: TopOpenKey) {
    const { browseToProfessions, currentRegion, currentRealm } = this.props;
    const { topOpenMap } = this.state;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    if (id === TopOpenKey.summary) {
      browseToProfessions(currentRegion, currentRealm);

      return;
    }

    this.setState({ topOpenMap: { ...topOpenMap, [id]: !topOpenMap[id] } });
  }

  private onExpansionClick(id: string) {
    const {
      expansions,
      currentRegion,
      currentRealm,
      browseToProfessionExpansion,
      selectedProfession,
    } = this.props;

    const expansion = expansions.reduce<IExpansion | null>((result, v) => {
      if (result !== null) {
        return result;
      }

      if (v.name === id) {
        return v;
      }

      return null;
    }, null);

    if (
      expansion === null ||
      currentRegion === null ||
      currentRealm === null ||
      selectedProfession === null
    ) {
      return;
    }

    browseToProfessionExpansion(currentRegion, currentRealm, selectedProfession, expansion);
  }

  private onNodeClick(node: ITreeNode) {
    const separatorIndex = node.id.toString().indexOf("-");
    if (separatorIndex === -1) {
      return;
    }

    const [kind, id] = [
      node.id.toString().substr(0, separatorIndex),
      node.id.toString().substr(separatorIndex + 1),
    ];
    const nodeClickMap: INodeClickMap = {
      expansion: (v: string) => this.onExpansionClick(v),
      pricelist: (v: string) => this.onPricelistNodeClick(v),
      profession: (v: string) => this.onProfessionNodeClick(v),
      top: (v: string) => this.onTopNodeClick(v as TopOpenKey),
    };

    if (!(kind in nodeClickMap)) {
      return;
    }

    nodeClickMap[kind](id);
  }
}
