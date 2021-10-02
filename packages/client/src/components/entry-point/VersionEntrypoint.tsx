import React from "react";

import { GameVersion, IConfigRegion, RegionVersionTuple } from "@sotah-inc/core";

export interface IRouteProps {
  redirectToRegion: (tuple: RegionVersionTuple) => void;
}

export interface IStateProps {
  currentGameVersion: GameVersion | null;
  currentRegion: IConfigRegion | null;
}

export interface IOwnProps {
  label: string;
}

export type Props = Readonly<IStateProps & IOwnProps & IRouteProps>;

export function VersionEntrypoint({
  currentGameVersion,
  currentRegion,
  redirectToRegion,
  label,
}: Props): JSX.Element | null {
  if (currentGameVersion === null) {
    return null;
  }

  if (currentRegion === null) {
    return null;
  }

  redirectToRegion({ game_version: currentGameVersion, region_name: currentRegion.name });

  return (
    <p>
      Redirecting to {label} for {currentGameVersion} - {currentRegion.name}!
    </p>
  );
}
