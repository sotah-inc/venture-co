import React from "react";

import { GameVersion, IConfigRegion, RegionVersionTuple } from "@sotah-inc/core";

import { ILoadVersionEntrypoint } from "../../actions/main";

export interface IStateProps {
  currentGameVersion: GameVersion | null;
  currentRegion: IConfigRegion | null;
}

export interface IDispatchProps {
  loadVersionEntrypoint: (payload: ILoadVersionEntrypoint) => void;
}

export interface IOwnProps {
  versionEntrypointData: ILoadVersionEntrypoint;
  label: string;
}

export interface IRouteProps {
  redirectToRegion: (tuple: RegionVersionTuple) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class VersionEntrypoint extends React.Component<Props> {
  public componentDidMount(): void {
    const { loadVersionEntrypoint, versionEntrypointData } = this.props;

    loadVersionEntrypoint(versionEntrypointData);
  }

  public render(): React.ReactNode {
    const { currentGameVersion, currentRegion, redirectToRegion, label } = this.props;

    if (currentGameVersion === null || currentRegion === null) {
      return null;
    }

    redirectToRegion({ game_version: currentGameVersion, region_name: currentRegion.name });

    return (
      <p>
        Redirecting to {label} for {currentGameVersion}!
      </p>
    );
  }
}
