import React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";

import { IProfile } from "../../types/global";

export interface IStateProps {
  profile: IProfile | null;
}

export interface IRouteProps {
  asPath: string;

  redirectToLastPath: (pathname: string, asPath: string) => void;
  redirectToHome: () => void;
}

export type Props = Readonly<IStateProps & IRouteProps>;

export class UserVerify extends React.Component<Props> {
  public componentDidMount(): void {
    const { redirectToLastPath, profile, redirectToHome, asPath } = this.props;

    if (profile === null) {
      redirectToHome();

      return;
    }

    if (profile.user.lastClientAsPath === null || profile.user.lastClientPathname === null) {
      redirectToHome();

      return;
    }

    if (profile.user.lastClientAsPath === asPath) {
      redirectToHome();

      return;
    }

    redirectToLastPath(profile.user.lastClientPathname, profile.user.lastClientAsPath);
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
