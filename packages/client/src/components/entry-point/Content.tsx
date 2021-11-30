import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";

import { IVersionToggleConfig } from "../../types/global";

export interface IDispatchProps {
  setVersionToggleConfig: (config: IVersionToggleConfig) => void;
}
export interface IRouteProps {
  redirectToNews: () => void;
}

export type Props = Readonly<IDispatchProps & IRouteProps>;

export class Content extends React.Component<Props> {
  public componentDidMount(): void {
    const { redirectToNews, setVersionToggleConfig } = this.props;

    redirectToNews();
    setVersionToggleConfig({
      destinations: [],
    });
  }

  public render(): React.ReactNode {
    return (
      <NonIdealState
        title="Redirecting to News!"
        icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
      />
    );
  }
}
