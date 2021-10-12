import React from "react";

import { GameVersion } from "@sotah-inc/core";

export interface IStateProps {
  currentGameVersion: GameVersion | null;
}

export interface IDispatchProps {
  loadBaseEntrypoint: () => void;
}

export interface IOwnProps {
  label: string;
}

export interface IRouteProps {
  redirectToVersion: (gameVersion: GameVersion) => void;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class BaseEntrypoint extends React.Component<Props> {
  public componentDidMount(): void {
    const { loadBaseEntrypoint } = this.props;

    loadBaseEntrypoint();
  }

  public render(): React.ReactNode {
    const { currentGameVersion, label, redirectToVersion } = this.props;

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
