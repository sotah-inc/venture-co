import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";

export interface IRouteProps {
  redirectToNews: () => void;
}

export type Props = Readonly<IRouteProps>;

export class Content extends React.Component<Props> {
  public componentDidMount() {
    const { redirectToNews } = this.props;

    redirectToNews();
  }

  public render() {
    return (
      <NonIdealState
        title="Redirecting to News!"
        icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
      />
    );
  }
}
