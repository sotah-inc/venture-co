import React from "react";

import { RenderMode } from "../../types/global";
import { AuthLevel, UserData } from "../../types/main";

export interface IStateProps {
  userData: UserData;
  renderMode: RenderMode;
}

export type Props = Readonly<IStateProps>;

export class DebugInfo extends React.Component<Props> {
  public render(): React.ReactNode {
    const { userData, renderMode } = this.props;

    return (
      <>
        <hr />
        <ul>
          <li>AuthLevel: {AuthLevel[userData.authLevel]}</li>
          <li>RenderMode: {RenderMode[renderMode]}</li>
        </ul>
      </>
    );
  }
}
