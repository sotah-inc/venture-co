import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { ILoadRootEntrypoint } from "../../actions/main";
import { FetchLevel } from "../../types/main";

export interface IRouteProps {
  redirectToContent: () => void;
}

export interface IDispatchProps {
  loadRootEntrypoint: (payload: ILoadRootEntrypoint) => void;
}

export interface IStateProps {
  fetchPingLevel: FetchLevel;
  fetchBootLevel: FetchLevel;
}

export interface IOwnProps {
  rootEntrypointData?: ILoadRootEntrypoint;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class Root extends React.Component<Props> {
  public componentDidMount() {
    const {
      fetchBootLevel,
      fetchPingLevel,
      loadRootEntrypoint,
      rootEntrypointData,
      redirectToContent,
    } = this.props;

    if (fetchPingLevel === FetchLevel.success && fetchBootLevel === FetchLevel.success) {
      redirectToContent();

      return;
    }

    const shouldLoad =
      fetchPingLevel === FetchLevel.initial && fetchBootLevel === FetchLevel.initial;
    if (shouldLoad && typeof rootEntrypointData !== "undefined") {
      loadRootEntrypoint(rootEntrypointData);

      return;
    }
  }

  public componentDidUpdate(_prevProps: Props) {
    const { fetchBootLevel, fetchPingLevel, redirectToContent } = this.props;

    if (fetchPingLevel === FetchLevel.success && fetchBootLevel === FetchLevel.success) {
      redirectToContent();

      return;
    }
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
        title="Redirecting to content!"
        icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
      />
    );
  }
}
