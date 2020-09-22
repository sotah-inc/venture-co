import { Classes, Intent, ITreeNode, Spinner, Tree } from "@blueprintjs/core";
import {
  IExpansion,
  IPricelistJson,
  IProfession,
  IProfessionPricelistJson,
  IRegionComposite,
  IShortItem,
  Locale,
} from "@sotah-inc/core";
import React from "react";

// tslint:disable-next-line:max-line-length
import { TreeContentContainer } from "../../../containers/entry-point/PriceLists/PricelistTree/TreeContent";
import { IClientRealm, IProfile } from "../../../types/global";
import { AuthLevel, FetchLevel } from "../../../types/main";
import { getItemFromPricelist } from "../../../util";
import { ProfessionIcon } from "../../util";
import { ItemIcon } from "../../util/ItemIcon";

export interface IStateProps {
  pricelists: IPricelistJson[];
  items: IShortItem[];
  selectedList: IPricelistJson | null;
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  professions: IProfession[];
  selectedProfession: IProfession | null;
  getProfessionPricelistsLevel: FetchLevel;
  professionPricelists: IProfessionPricelistJson[];
  expansions: IExpansion[];
  selectedExpansion: IExpansion | null;
  authLevel: AuthLevel;
  profile: IProfile | null;
  getPricelistsLevel: FetchLevel;
}

export interface IDispatchProps {
  refreshPricelists: (opts: { token: string; locale: Locale }) => void;
}

export interface IRouteProps {
  browseToUserPricelist: (
    region: IRegionComposite,
    realm: IClientRealm,
    pricelist: IPricelistJson,
  ) => void;
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
        refreshPricelists({ token: profile.token, locale: Locale.EnUS });

        return;
      default:
        return;
    }
  }

  public componentDidUpdate(_prevProps: Props) {
    const { refreshPricelists, profile, getPricelistsLevel } = this.props;

    if (profile === null) {
      return;
    }

    switch (getPricelistsLevel) {
      case FetchLevel.initial:
        refreshPricelists({ token: profile.token, locale: Locale.EnUS });

        return;
      default:
        return;
    }
  }

  public render() {
    const { authLevel, currentRealm, currentRegion, selectedProfession } = this.props;
    const { topOpenMap } = this.state;

    const nodes: ITreeNode[] = [];
    if (currentRegion !== null && currentRealm !== null) {
      nodes.push({
        id: `top-summary`,
        isSelected: this.isSummarySelected(),
        label: `${currentRegion.config_region.name.toUpperCase()}-${
          currentRealm.realm.name.en_US
        } Summary`,
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
      childNodes: this.getProfessionPricelistNodes(),
      hasCaret: true,
      icon:
        selectedProfession === null ? "list" : <ProfessionIcon profession={selectedProfession} />,
      id: `top-${TopOpenKey.professions}`,
      isExpanded: topOpenMap[TopOpenKey.professions],
      label:
        selectedProfession === null
          ? "Profession Pricelists"
          : `${selectedProfession.label} Pricelists`,
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

  private getProfessionPricelistNodes(): ITreeNode[] {
    const { professionPricelists, getProfessionPricelistsLevel } = this.props;

    switch (getProfessionPricelistsLevel) {
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

    if (professionPricelists.length === 0) {
      return [{ id: "none-none", label: <em>None found.</em> }];
    }

    const pricelistNodes = professionPricelists.map(v => this.getPricelistNode(v.pricelist!));
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

    const foundProfessionPricelist = professionPricelists.reduce<IPricelistJson | null>(
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
      selectedExpansion,
      selectedProfession,
      foundProfessionPricelist,
    );
  }

  private onProfessionNodeClick(id: string) {
    const {
      professions,
      currentRegion,
      currentRealm,
      browseToProfession,
      selectedExpansion,
    } = this.props;

    if (currentRegion === null || currentRealm === null || selectedExpansion === null) {
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

    if (profession === null) {
      return;
    }

    browseToProfession(currentRegion, currentRealm, selectedExpansion, profession);
  }

  private onTopNodeClick(id: TopOpenKey) {
    const { browseToExpansion, currentRegion, currentRealm, selectedExpansion } = this.props;
    const { topOpenMap } = this.state;

    if (currentRegion === null || currentRealm === null || selectedExpansion === null) {
      return;
    }

    if (id === TopOpenKey.summary) {
      browseToExpansion(currentRegion, currentRealm, selectedExpansion);

      return;
    }

    this.setState({ topOpenMap: { ...topOpenMap, [id]: !topOpenMap[id] } });
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
