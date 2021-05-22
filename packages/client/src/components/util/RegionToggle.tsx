import React from "react";

import { Button, Classes, H6, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { IGetBootResponseData, IRegionComposite } from "@sotah-inc/core";

import { IFetchData } from "../../types/global";

export interface IStateProps {
  bootData: IFetchData<IGetBootResponseData>;
  currentRegion: IRegionComposite | null;
}

export interface IDispatchProps {
  onRegionChange: (region: IRegionComposite) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class RegionToggle extends React.Component<Props> {
  private renderMenuItem(region: IRegionComposite, index: number): React.ReactElement {
    const { currentRegion, onRegionChange } = this.props;

    let className = "";
    if (currentRegion !== null && region.config_region.name === currentRegion.config_region.name) {
      className = Classes.ACTIVE;
    }

    return (
      <MenuItem
        key={index}
        icon="geosearch"
        className={className}
        text={region.config_region.name.toUpperCase()}
        onClick={() => onRegionChange(region)}
      />
    );
  }

  private renderMenu(): React.ReactElement {
    const { bootData } = this.props;

    return (
      <Menu>
        <li>
          <H6>Select Region</H6>
        </li>
        {bootData.data.regions.map((region, index) => this.renderMenuItem(region, index))}
      </Menu>
    );
  }

  public render(): React.ReactNode {
    const { currentRegion } = this.props;

    if (currentRegion === null) {
      return <React.Fragment />;
    }

    return (
      <Popover2 content={this.renderMenu()} placement={"bottom-end"}>
        <Button icon="double-caret-vertical">
          {currentRegion.config_region.name.toUpperCase()}
        </Button>
      </Popover2>
    );
  }
}
