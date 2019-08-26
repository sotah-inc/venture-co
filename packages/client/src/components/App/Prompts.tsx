import * as React from "react";

import { Button, Callout, Intent } from "@blueprintjs/core";

import { IUserJson, UserLevel } from "../../api-types/entities";

export interface IStateProps {
  user: IUserJson | null;
}

export interface IDispatchProps {
  hello: () => void;
}

// tslint:disable-next-line:no-empty-interface
export interface IRouteProps {}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps>;

export class Prompts extends React.Component<Props> {
  public render() {
    const { user } = this.props;

    if (user === null) {
      return null;
    }

    if (user.level === UserLevel.Unverified) {
      return this.renderUnverified();
    }

    return null;
  }

  private renderUnverified() {
    return (
      <div style={{ marginBottom: "10px" }}>
        <Callout intent={Intent.PRIMARY} title="Unverified Account">
          <p>Your account is not verified!</p>
          <p>
            <Button
              icon={"envelope"}
              intent={Intent.PRIMARY}
              onClick={() => {
                // tslint:disable-next-line:no-console
                console.log("wew lad");
              }}
              text="Verify with Email"
            />
          </p>
        </Callout>
      </div>
    );
  }
}
