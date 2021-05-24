import React from "react";

import {
  Breadcrumbs,
  Classes,
  H2,
  IBreadcrumbProps,
  Intent,
  IToastProps,
  NonIdealState,
  Spinner,
} from "@blueprintjs/core";
import { IUpdateProfileRequest } from "@sotah-inc/core";

import {
  ManageAccountFormFormContainer,
} from "../../../form-containers/App/Profile/ManageAccountForm";
import { IErrors } from "../../../types/global";
import { AuthLevel, FetchLevel, UserData } from "../../../types/main";
import { setTitle } from "../../../util";
import { IFormValues } from "./ManageAccountForm";

export interface IStateProps {
  userData: UserData;
  updateProfileLevel: FetchLevel;
  updateProfileErrors: IErrors;
}

export interface IDispatchProps {
  updateProfile: (token: string, req: IUpdateProfileRequest) => void;
  insertToast: (toast: IToastProps) => void;
}

export interface IRouteProps {
  browseToHome: () => void;
  browseToProfile: () => void;
}

export type IOwnProps = IRouteProps;

type Props = Readonly<IRouteProps & IOwnProps & IStateProps & IDispatchProps>;

export class ManageAccount extends React.Component<Props> {
  public componentDidMount(): void {
    setTitle("Profile");
  }

  public render(): React.ReactNode {
    const {
      updateProfile,
      userData,
      updateProfileErrors,
      updateProfileLevel,
      insertToast,
    } = this.props;

    if (userData.authLevel !== AuthLevel.authenticated) {
      return (
        <NonIdealState
          title="Unauthorized"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={0} />}
          description={"You must be logged in to view this page!"}
        />
      );
    }

    return (
      <>
        <H2>Manage Account</H2>
        {this.renderBreadcrumbs()}
        <ManageAccountFormFormContainer
          defaultFormValues={{ email: "" }}
          onComplete={() => {
            insertToast({
              icon: "info-sign",
              intent: "success",
              message: "Your profile has been updated!",
            });
          }}
          onFatalError={err => {
            insertToast({
              icon: "warning-sign",
              intent: "danger",
              message: `Could not save profile: ${err}`,
            });
          }}
          onSubmit={(v: IFormValues) => updateProfile(userData.profile.token, { email: v.email })}
          updateProfileErrors={updateProfileErrors}
          updateProfileLevel={updateProfileLevel}
        />
      </>
    );
  }

  private renderBreadcrumbs() {
    const { browseToHome, browseToProfile } = this.props;

    const breadcrumbs: IBreadcrumbProps[] = [
      {
        href: "/",
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();

          browseToHome();
        },
        text: "Home",
      },
      {
        href: "/profile",
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();

          browseToProfile();
        },
        text: "Profile",
      },
      {
        text: "Manage Account",
      },
    ];

    return (
      <div style={{ marginBottom: "10px" }}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
    );
  }
}
