import React from "react";

import { setTitle } from "../../util";

export interface IRouteProps {
  browseToManageAccount: () => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IOwnProps>;

export class Profile extends React.Component<Props> {
  public componentDidMount() {
    setTitle("Redirecting to Manage Account");
  }

  public render(): React.ReactNode {
    // props
    const { browseToManageAccount } = this.props;

    browseToManageAccount();

    return <p>Redirecting to Manage Account</p>;
  }
}
