import React from "react";

import { Button, Callout, Intent } from "@blueprintjs/core";
import { IVerifyUserResponseData, UserLevel } from "@sotah-inc/core";

import { IFetchData, IProfile } from "../../types/global";
import { FetchLevel } from "../../types/main";

export interface IStateProps {
  profile: IProfile | null;
  verifyUser: IFetchData<IVerifyUserResponseData>;
}

export interface IDispatchProps {
  fetchVerifyUser: (token: string) => void;
}

export interface IRouteProps {
  redirectToVerifyUser: (destination: string) => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class Prompts extends React.Component<Props> {
  public componentDidUpdate(prevProps: Readonly<Props>): void {
    const { verifyUser, redirectToVerifyUser } = this.props;

    if (
      prevProps.verifyUser.level === FetchLevel.fetching &&
      verifyUser.level === FetchLevel.success
    ) {
      redirectToVerifyUser(verifyUser.data.destination);

      return;
    }
  }

  public render(): React.ReactNode {
    const { profile } = this.props;

    if (profile === null) {
      return null;
    }

    if (profile.user.level === UserLevel.Unverified) {
      return this.renderUnverified();
    }

    return null;
  }

  private renderUnverified() {
    const { verifyUser, profile, fetchVerifyUser } = this.props;

    if (profile === null) {
      return null;
    }

    const errors = (() => {
      if (verifyUser.level !== FetchLevel.failure) {
        return null;
      }

      return (
        <ul>
          {Object.values(verifyUser.errors).map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      );
    })();

    return (
      <div style={{ marginBottom: "10px" }}>
        <Callout intent={Intent.PRIMARY} title="Unverified Account">
          <p>Your account is not verified!</p>
          {errors}
          <p>
            <Button
              icon={"envelope"}
              intent={verifyUser.level === FetchLevel.failure ? Intent.WARNING : Intent.PRIMARY}
              onClick={() => {
                if (verifyUser.level !== FetchLevel.initial) {
                  return;
                }

                fetchVerifyUser(profile.token);
              }}
              text="Verify with Email"
              disabled={verifyUser.level !== FetchLevel.initial}
            />
          </p>
        </Callout>
      </div>
    );
  }
}
