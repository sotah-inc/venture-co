import React from "react";

import { AuthLevel, UserData } from "../../types/main";

export interface IStateProps {
  userData: UserData;
}

export type Props = Readonly<IStateProps>;

export class DebugInfo extends React.Component<Props> {
  public render(): React.ReactNode {
    const { userData } = this.props;

    return (
      <>
        <hr />
        <ul>
          <li>AuthLevel: {AuthLevel[userData.authLevel]}</li>
        </ul>
      </>
    );
  }
}
