import React from "react";

import { IRegion } from "../../api-types/region";

export interface IRouteProps {
  redirectToRegion: (region: IRegion) => void;
}

export interface IStateProps {
  currentRegion: IRegion | null;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IOwnProps>;

export function Data({ currentRegion, redirectToRegion }: Props) {
  if (currentRegion === null) {
    return null;
  }

  redirectToRegion(currentRegion);

  return <p>Redirecting to data for {currentRegion.name}!</p>;
}
