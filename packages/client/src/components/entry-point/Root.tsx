import React from "react";

import { ILoadRootEntrypoint } from "../../actions/main";

export interface IRouteProps {
  redirectToContent: () => void;
}

export interface IDispatchProps {
  loadRootEntrypoint: (payload?: ILoadRootEntrypoint) => void;
}

export interface IOwnProps {
  rootEntrypointData?: ILoadRootEntrypoint;
}

export type Props = Readonly<IDispatchProps & IOwnProps & IRouteProps>;

export class Root extends React.Component<Props> {
  public componentDidMount() {
    const { redirectToContent, loadRootEntrypoint, rootEntrypointData } = this.props;

    loadRootEntrypoint(rootEntrypointData);
    redirectToContent();
  }

  public render() {
    return <p>Redirecting to content!</p>;
  }
}
