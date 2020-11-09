import React from "react";

import { Classes, ITreeNode, Tree } from "@blueprintjs/core";
import { IRegionComposite, IShortProfession } from "@sotah-inc/core";

import { IClientRealm, IFetchData } from "../../../types/global";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  currentRealm: IClientRealm | null;
  professions: IFetchData<IShortProfession[]>;
}

export type Props = Readonly<IStateProps>;

interface INodeClickMap {
  [key: string]: (v: string) => void;
}

export class ProfessionsTree extends React.Component<Props> {
  public render() {
    const { currentRealm, currentRegion } = this.props;

    const nodes: ITreeNode[] = [];
    if (currentRegion !== null && currentRealm !== null) {
      return null;
    }

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
              <p>Hello, world!</p>
            </div>
          </div>
        </div>
      </div>
    );
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
    const nodeClickMap: INodeClickMap = {};

    if (!Object.keys(nodeClickMap).includes(kind)) {
      return;
    }

    nodeClickMap[kind](id);
  }
}
