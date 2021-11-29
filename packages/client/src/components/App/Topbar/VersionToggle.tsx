import React from "react";

import { Icon, NavbarHeading } from "@blueprintjs/core";

import { IVersionToggleConfig } from "../../../types/global";

export interface IStateProps {
  versionToggleConfig: IVersionToggleConfig;
}

export interface IRouteProps {
  redirectToVersionDestination: (url: string, asDest: string) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IOwnProps>;

export class VersionToggle extends React.Component<Props> {
  public render(): React.ReactNode {
    const { versionToggleConfig } = this.props;

    // eslint-disable-next-line no-console
    console.log("VersionToggle.render()", { versionToggleConfig });

    return (
      <NavbarHeading>
        <Icon icon="globe" />
        <span style={{ marginLeft: "5px" }}>SotAH</span>
      </NavbarHeading>
    );
  }
}
