import React from "react";

import { IShortProfession } from "@sotah-inc/core";

import { ILoadProfessionsEndpoint } from "../../actions/professions";
import { IFetchData } from "../../types/global";
import { setTitle } from "../../util";

export interface IStateProps {
  professions: IFetchData<IShortProfession[]>;
}

export interface IDispatchProps {
  loadEntrypointData: (payload: ILoadProfessionsEndpoint) => void;
}

export interface IOwnProps {
  entrypointData: ILoadProfessionsEndpoint;
}

export interface IRouteProps {
  historyPush: (destination: string, asDest?: string) => void;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class Professions extends React.Component<Props> {
  public componentDidMount() {
    const { entrypointData, loadEntrypointData } = this.props;

    setTitle("Professions");

    loadEntrypointData(entrypointData);
  }

  public componentDidUpdate(prevProps: Props) {
    const { entrypointData, loadEntrypointData } = this.props;

    if (entrypointData.loadId !== prevProps.entrypointData.loadId) {
      setTitle("Professions");

      loadEntrypointData(entrypointData);

      return;
    }
  }

  public render() {
    return <p>Hello, world!</p>;
  }
}
