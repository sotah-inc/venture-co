import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";

export interface IRouteProps {
  redirectToContent: () => void;
}

export type Props = Readonly<IRouteProps>;

export class Root extends React.Component<Props> {
  public componentDidMount(): void {
    const { redirectToContent } = this.props;

    redirectToContent();
  }

  public render(): React.ReactNode {
    return (
      <NonIdealState
        title="Redirecting to content!"
        icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
      />
    );
  }
}
