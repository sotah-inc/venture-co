import React from "react";

import { Classes, Intent, ITreeNode, Spinner, Tree } from "@blueprintjs/core";
import { IRegionComposite, IShortProfession } from "@sotah-inc/core";

import { IClientRealm, IFetchData } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { ShortProfessionIcon } from "../../util/ShortProfessionIcon";

// props
export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  professions: IFetchData<IShortProfession[]>;
}

export type Props = Readonly<IStateProps>;

// state
interface INodeClickMap {
  [key: string]: (v: string) => void;
}

enum TopOpenKey {
  professions = "professions",
}

interface IState {
  topOpenMap: {
    [key: string]: boolean;
  };
}

export class ProfessionsTree extends React.Component<Props, IState> {
  public state: IState = {
    topOpenMap: {
      [TopOpenKey.professions]: true,
    },
  };

  public render() {
    const { topOpenMap } = this.state;

    const nodes: ITreeNode[] = [];

    // appending profession nodes
    nodes.push({
      childNodes: this.getProfessionNodes(),
      hasCaret: true,
      icon: "list",
      id: `top-${TopOpenKey.professions}`,
      isExpanded: topOpenMap[TopOpenKey.professions],
      label: "Professions",
    });

    return (
      <div style={{ marginTop: "10px" }}>
        <div className="pure-g">
          <div className="pure-u-1-4 profession-tree">
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
              <p>Hello, world!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getProfessionNodes(): ITreeNode[] {
    const { professions } = this.props;

    switch (professions.level) {
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
            label: <span style={{ marginLeft: "5px" }}>Failed to load professions!</span>,
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

    if (professions.data.length === 0) {
      return [{ id: "none-none", label: <em>None found.</em> }];
    }

    return professions.data.map(v => this.getProfessionNode(v));
  }

  private getProfessionNode(v: IShortProfession) {
    const result: ITreeNode = {
      className: "profession-node",
      icon: <ShortProfessionIcon profession={v} />,
      id: `profession-${v.id}`,
      label: v.name,
    };

    return result;
  }

  private onTopNodeClick(id: TopOpenKey) {
    const { currentRegion, currentRealm } = this.props;
    const { topOpenMap } = this.state;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    this.setState({ topOpenMap: { ...topOpenMap, [id]: !topOpenMap[id] } });
  }

  private onProfessionNodeClick(id: string) {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return;
    }

    // tslint:disable-next-line:no-console
    console.log(`profession ${id}`);
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
      profession: (v: string) => this.onProfessionNodeClick(v),
      top: (v: string) => this.onTopNodeClick(v as TopOpenKey),
    };

    if (!Object.keys(nodeClickMap).includes(kind)) {
      return;
    }

    nodeClickMap[kind](id);
  }
}
