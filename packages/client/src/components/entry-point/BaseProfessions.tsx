import React from "react";

import { IRegionComposite } from "@sotah-inc/core";

export interface IRouteProps {
  redirectToRegion: (region: IRegionComposite) => void;
}

export interface IStateProps {
  currentRegion: IRegionComposite | null;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IOwnProps>;

export function BaseProfessions({ currentRegion, redirectToRegion }: Props) {
  if (currentRegion === null) {
    return null;
  }

  redirectToRegion(currentRegion);

  return <p>Redirecting to professions for {currentRegion.config_region.name}!</p>;
}
