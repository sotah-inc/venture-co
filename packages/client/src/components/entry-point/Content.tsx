import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { ILoadRootEntrypoint } from "../../actions/main";
import { FetchLevel } from "../../types/main";

export interface IRouteProps {
  redirectToNews: () => void;
}

export interface IDispatchProps {
  loadRootEntrypoint: (payload?: ILoadRootEntrypoint) => void;
}

export interface IStateProps {
  fetchPingLevel: FetchLevel;
  fetchBootLevel: FetchLevel;
}

export interface IOwnProps {
  rootEntrypointData?: ILoadRootEntrypoint;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class Content extends React.Component<Props> {
  public componentDidMount() {
    const { loadRootEntrypoint, rootEntrypointData } = this.props;

    if (typeof rootEntrypointData !== "undefined") {
      loadRootEntrypoint(rootEntrypointData);
    }
  }

  public componentDidUpdate(_prevProps: Props) {
    const { fetchBootLevel, fetchPingLevel, redirectToNews } = this.props;

    if (fetchPingLevel !== FetchLevel.success) {
      return;
    }

    if (fetchBootLevel !== FetchLevel.success) {
      return;
    }

    redirectToNews();
  }

  public render() {
    // props
    const { fetchPingLevel, fetchBootLevel } = this.props;

    if (fetchPingLevel !== FetchLevel.success) {
      return (
        <NonIdealState
          title="Connecting..."
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
        />
      );
    }

    if (fetchBootLevel !== FetchLevel.success) {
      return (
        <NonIdealState
          title="Booting..."
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
        />
      );
    }

    return (
      <NonIdealState
        title="Redirecting to News!"
        icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
      />
    );
  }
}
