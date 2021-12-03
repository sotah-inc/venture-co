import React from "react";

import { Button, Classes, H6, ButtonProps, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { GameVersion } from "@sotah-inc/core";

import { LinkButtonRouteContainer } from "../../route-containers/util/LinkButton";
import { IRouteConfig, VersionRouteConfig } from "../../types/global";

export interface IStateProps {
  currentGameVersion: GameVersion | null;
  gameVersions: GameVersion[];
}

export interface IRouteProps {
  redirectToVersionDestination: (url: string, asDest: string) => void;
  locationAsPath: string;
}

export interface IOwnProps {
  buttonProps: ButtonProps;
  resolveRouteConfig: (version: GameVersion) => IRouteConfig;
  exactOrPrefix?: boolean;
}

export type Props = Readonly<IStateProps & IOwnProps & IRouteProps>;

export class VersionToggle extends React.Component<Props> {
  private renderMenuItem(config: VersionRouteConfig, index: number): React.ReactElement {
    const { redirectToVersionDestination, currentGameVersion, buttonProps } = this.props;

    const className =
      currentGameVersion !== null && config.game_version === currentGameVersion
        ? Classes.ACTIVE
        : "";

    return (
      <MenuItem
        key={index}
        className={className}
        text={`${buttonProps.text} (${config.game_version})`}
        onClick={() => redirectToVersionDestination(config.url, config.asDest)}
      />
    );
  }

  private renderMenu(): React.ReactElement {
    const { gameVersions, resolveRouteConfig } = this.props;

    return (
      <Menu>
        <li>
          <H6>Select Version</H6>
        </li>
        {gameVersions.map((gameVersion, index) =>
          this.renderMenuItem(
            { ...resolveRouteConfig(gameVersion), game_version: gameVersion },
            index,
          ),
        )}
      </Menu>
    );
  }

  public render(): React.ReactNode {
    const {
      currentGameVersion,
      buttonProps,
      gameVersions,
      locationAsPath,
      resolveRouteConfig,
      exactOrPrefix,
    } = this.props;

    if (gameVersions.length === 0 || currentGameVersion === null) {
      return (
        <LinkButtonRouteContainer
          destination={""}
          asDestination={""}
          buttonProps={{ ...buttonProps, disabled: true }}
        />
      );
    }

    const currentRouteConfig = resolveRouteConfig(currentGameVersion);
    const isCurrent = exactOrPrefix
      ? locationAsPath.startsWith(currentRouteConfig.asDest)
      : locationAsPath === currentRouteConfig.asDest;
    if (!isCurrent) {
      return (
        <LinkButtonRouteContainer
          destination={currentRouteConfig.url}
          asDestination={currentRouteConfig.asDest}
          buttonProps={buttonProps}
        />
      );
    }

    return (
      <Popover2 content={this.renderMenu()} placement={"bottom-end"}>
        <Button
          {...buttonProps}
          active={true}
          text={`${buttonProps.text} (${currentGameVersion})`}
          rightIcon="double-caret-vertical"
        />
      </Popover2>
    );
  }
}
