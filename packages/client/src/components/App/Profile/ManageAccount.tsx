import * as React from "react";

import {
  Breadcrumbs,
  Classes,
  H2,
  IBreadcrumbProps,
  Intent,
  NonIdealState,
  Spinner,
} from "@blueprintjs/core";

import { IUpdateProfileRequest } from "../../../api-types/contracts/user/profile";
import { IUserJson } from "../../../api-types/entities";
// tslint:disable-next-line:max-line-length
import { ManageAccountFormFormContainer } from "../../../form-containers/App/Profile/ManageAccountForm";
import { IErrors } from "../../../types/global";
import { FetchLevel } from "../../../types/main";
import { setTitle } from "../../../util";
import { GetAppToaster } from "../../../util/toasters";
import { IFormValues } from "./ManageAccountForm";

export interface IStateProps {
  user: IUserJson | null;
  updateProfileLevel: FetchLevel;
  updateProfileErrors: IErrors;
  token: string | null;
}

export interface IDispatchProps {
  updateProfile: (token: string, req: IUpdateProfileRequest) => void;
}

export interface IRouteProps {
  browseToHome: () => void;
  browseToProfile: () => void;
}

export type IOwnProps = IRouteProps;

type Props = Readonly<IRouteProps & IOwnProps & IStateProps & IDispatchProps>;

export class ManageAccount extends React.Component<Props> {
  public componentDidMount() {
    setTitle("Profile");
  }

  public render() {
    const { user, updateProfile, token, updateProfileErrors, updateProfileLevel } = this.props;

    if (user === null) {
      return (
        <NonIdealState
          title="Unauthorized"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={0} />}
          description={"You must be logged in to view this page!"}
        />
      );
    }

    const AppToaster = GetAppToaster(false);

    return (
      <>
        <H2>Manage Account</H2>
        {this.renderBreadcrumbs()}
        <ManageAccountFormFormContainer
          defaultFormValues={{ email: user.email }}
          onComplete={() => {
            if (AppToaster === null) {
              return;
            }

            AppToaster.show({
              icon: "info-sign",
              intent: "success",
              message: "Your profile has been updated!",
            });
          }}
          onFatalError={err => {
            if (AppToaster === null) {
              return;
            }

            AppToaster.show({
              icon: "warning-sign",
              intent: "danger",
              message: `Could not save profile: ${err}`,
            });
          }}
          onSubmit={(v: IFormValues) => updateProfile(token!, { email: v.email })}
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
