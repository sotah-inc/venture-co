import React from "react";

import { Button, Classes, H6, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
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
  public renderMenuItem(region: IRegionComposite, index: number): React.ReactElement {
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

  public renderMenu(regions: IRegions): React.ReactElement {
    return (
      <Menu>
        <li>
          <H6>Select Region</H6>
        </li>
        {Object.keys(regions).map((regionName, index) => {
          const foundRegion = regions[regionName];
          if (foundRegion === undefined) {
            return null;
          }

          return this.renderMenuItem(foundRegion, index);
        })}
      </Menu>
    );
  }

  public render(): React.ReactNode {
    const { currentRegion } = this.props;

    if (currentRegion === null) {
      return <React.Fragment />;
    }

    return (
      <Popover2 content={this.renderMenu(this.props.regions)} placement={"bottom-end"}>
        <Button icon="double-caret-vertical">
          {currentRegion.config_region.name.toUpperCase()}
        </Button>
      </Popover2>
    );
  }
}
