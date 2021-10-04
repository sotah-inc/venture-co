import React from "react";

import { GameVersion, IConfigRegion } from "@sotah-inc/core";

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
  redirectToVersion: (gameVersion: GameVersion) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class VersionEntrypoint extends React.Component<Props> {
  public componentDidMount(): void {
    const { loadVersionEntrypoint, versionEntrypointData } = this.props;

    loadVersionEntrypoint(versionEntrypointData);
  }

  public render(): React.ReactNode {
    const { currentGameVersion, redirectToVersion, label } = this.props;

    if (currentGameVersion === null) {
      return null;
    }

    redirectToVersion(currentGameVersion);

    return (
      <p>
        Redirecting to {label} for {currentGameVersion}!
      </p>
    );
  }
}
