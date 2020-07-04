import React from "react";

import { Button, Classes, H6, Menu, MenuItem, Popover, Position } from "@blueprintjs/core";
import { IRegionComposite } from "@sotah-inc/core";

import { IRegions } from "../../types/global";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  regions: IRegions;
}

export interface IDispatchProps {
  onRegionChange: (region: IRegionComposite) => void;
}

type Props = Readonly<IStateProps & IDispatchProps>;

export class RegionToggle extends React.Component<Props> {
  public renderMenuItem(region: IRegionComposite, index: number) {
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

  public renderMenu(regions: IRegions) {
    return (
      <Menu>
        <li>
          <H6>Select Region</H6>
        </li>
        {Object.keys(regions).map((regionName, index) =>
          this.renderMenuItem(regions[regionName], index),
        )}
      </Menu>
    );
  }

  public render() {
    const { currentRegion } = this.props;

    if (currentRegion === null) {
      return null;
    }

    return (
      <Popover
        content={this.renderMenu(this.props.regions)}
        target={
          <Button icon="double-caret-vertical">
            {currentRegion.config_region.name.toUpperCase()}
          </Button>
        }
        position={Position.BOTTOM_RIGHT}
      />
    );
  }
}
