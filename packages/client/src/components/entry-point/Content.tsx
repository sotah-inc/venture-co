import React from "react";

import { ILoadRootEntrypoint } from "../../actions/main";

export interface IRouteProps {
  redirectToNews: () => void;
}

export interface IDispatchProps {
  loadRootEntrypoint: (payload?: ILoadRootEntrypoint) => void;
}

export interface IOwnProps {
  rootEntrypointData?: ILoadRootEntrypoint;
}

export type Props = Readonly<IDispatchProps & IOwnProps & IRouteProps>;

export class Content extends React.Component<Props> {
  public componentDidMount() {
    const { redirectToNews, loadRootEntrypoint, rootEntrypointData } = this.props;

    loadRootEntrypoint(rootEntrypointData);
    redirectToNews();
  }

  public render() {
    return <p>Redirecting to News</p>;
  }
}
