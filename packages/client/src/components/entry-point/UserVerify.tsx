import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";

import { AuthLevel, UserData } from "../../types/main";

export interface IStateProps {
  userData: UserData;
}

export interface IRouteProps {
  asPath: string;

  redirectToLastPath: (pathname: string, asPath: string) => void;
  redirectToHome: () => void;
}

export type Props = Readonly<IStateProps & IRouteProps>;

export class UserVerify extends React.Component<Props> {
  public componentDidMount(): void {
    const { redirectToLastPath, userData, redirectToHome, asPath } = this.props;

    if (userData.authLevel !== AuthLevel.authenticated) {
      redirectToHome();

      return;
    }

    if (
      userData.profile.user.lastClientAsPath === null ||
      userData.profile.user.lastClientPathname === null
    ) {
      redirectToHome();

      return;
    }

    if (userData.profile.user.lastClientAsPath === asPath) {
      redirectToHome();

      return;
    }

    redirectToLastPath(
      userData.profile.user.lastClientPathname,
      userData.profile.user.lastClientAsPath,
    );
  }

  public render(): React.ReactNode {
    return (
      <NonIdealState
        title="Thank you for verifying your account!"
        icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
      />
    );
  }
}
