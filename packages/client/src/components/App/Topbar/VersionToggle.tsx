import React from "react";

import { Button, Classes, H6, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { GameVersion } from "@sotah-inc/core";

import { LinkButtonRouteContainer } from "../../../route-containers/util/LinkButton";
import { IVersionToggleConfig, VersionRouteConfig } from "../../../types/global";

export interface IStateProps {
  versionToggleConfig: IVersionToggleConfig;
  currentGameVersion: GameVersion | null;
}

export interface IRouteProps {
  redirectToVersionDestination: (url: string, asDest: string) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IOwnProps>;

export class VersionToggle extends React.Component<Props> {
  private renderMenuItem(config: VersionRouteConfig, index: number): React.ReactElement {
    const { redirectToVersionDestination, currentGameVersion } = this.props;

    const className =
      currentGameVersion !== null && config.game_version === currentGameVersion
        ? Classes.ACTIVE
        : "";

    return (
      <MenuItem
        key={index}
        className={className}
        text={`SotAH (${config.game_version})`}
        onClick={() => redirectToVersionDestination(config.url, config.asDest)}
      />
    );
  }

  private renderMenu(): React.ReactElement {
    const { versionToggleConfig } = this.props;

    return (
      <Menu>
        <li>
          <H6>Select Version</H6>
        </li>
        {versionToggleConfig.destinations.map((config, index) =>
          this.renderMenuItem(config, index),
        )}
      </Menu>
    );
  }

  public render(): React.ReactNode {
    const { versionToggleConfig, currentGameVersion } = this.props;

    if (versionToggleConfig.destinations.length === 0 || currentGameVersion === null) {
      return (
        <LinkButtonRouteContainer
          destination={"/"}
          asDestination={"/"}
          buttonProps={{ icon: "globe", minimal: true, large: true, text: "SotAH" }}
        />
      );
    }

    return (
      <Popover2 content={this.renderMenu()} placement={"bottom-end"}>
        <Button icon="double-caret-vertical" minimal={true} large={true}>
          SotAH ({currentGameVersion})
        </Button>
      </Popover2>
    );
  }
}
