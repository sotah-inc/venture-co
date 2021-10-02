import React from "react";

import { GameVersion } from "@sotah-inc/core";

export interface IRouteProps {
  redirectToVersion: (gameVersion: GameVersion) => void;
}

export interface IStateProps {
  currentGameVersion: GameVersion | null;
}

export interface IOwnProps {
  label: string;
}

export type Props = Readonly<IStateProps & IOwnProps & IRouteProps>;

export function BaseEntrypoint({
  currentGameVersion,
  redirectToVersion,
  label,
}: Props): JSX.Element | null {
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
