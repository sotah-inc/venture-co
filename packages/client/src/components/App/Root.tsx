import * as React from "react";

export interface IRouteProps {
  redirectToContent: () => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IOwnProps>;

export function Root({ redirectToContent }: Props) {
  redirectToContent();

  return <p>Redirecting to content!</p>;
}
