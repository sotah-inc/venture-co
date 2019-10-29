import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { ILoadRootEntrypoint } from "../../../actions/main";
import { FetchLevel } from "../../../types/main";

export interface IDispatchProps {
  loadRootEntrypoint: (payload?: ILoadRootEntrypoint) => void;
}

export interface IStateProps {
  fetchPingLevel: FetchLevel;
  fetchBootLevel: FetchLevel;
}

export interface IOwnProps {
  rootEntrypointData?: ILoadRootEntrypoint;
  children: React.ReactNode;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class Init extends React.Component<Props> {
  public componentDidMount() {
    const { fetchBootLevel, fetchPingLevel, loadRootEntrypoint, rootEntrypointData } = this.props;

    const shouldLoad =
      fetchPingLevel === FetchLevel.initial && fetchBootLevel === FetchLevel.initial;
    if (shouldLoad && typeof rootEntrypointData !== "undefined") {
      loadRootEntrypoint(rootEntrypointData);
    }
  }

  public componentDidUpdate(_prevProps: Props) {
    const { fetchBootLevel, fetchPingLevel } = this.props;

    if (fetchPingLevel !== FetchLevel.success) {
      return;
    }

    if (fetchBootLevel !== FetchLevel.success) {
      return;
    }
  }

  public render() {
    // props
    const { fetchPingLevel, fetchBootLevel, children } = this.props;

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

    return children;
  }
}
