import React from "react";

import { IRegionComposite } from "@sotah-inc/core";

export interface IRouteProps {
  redirectToRegion: (region: IRegionComposite) => void;
}

export interface IStateProps {
  currentRegion: IRegionComposite | null;
}

export interface IOwnProps {
  label: string;
}

export type Props = Readonly<IStateProps & IOwnProps & IRouteProps>;

export function BaseEntrypoint({
  currentRegion,
  redirectToRegion,
  label,
}: Props): JSX.Element | null {
  if (currentRegion === null) {
    return null;
  }

  redirectToRegion(currentRegion);

  return (
    <p>
      Redirecting to {label} for {currentRegion.config_region.name}!
    </p>
  );
}
