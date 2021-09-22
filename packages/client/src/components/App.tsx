import React, { ReactNode } from "react";

import { Classes, Intent, IToastProps, NonIdealState, Spinner } from "@blueprintjs/core";
import { IGetBootResponseData, IPreferenceJson, IConfigRegion } from "@sotah-inc/core";
import { Cookies, withCookies } from "react-cookie";

import { ILoadRootEntrypoint } from "../actions/main";
import { PromptsRouteContainer } from "../route-containers/App/Prompts";
import { TopbarRouteContainer } from "../route-containers/App/Topbar";
import { IClientRealm, IFetchData } from "../types/global";
import { AuthLevel, FetchLevel, UserData } from "../types/main";

export interface IStateProps {
  bootData: IFetchData<IGetBootResponseData>;
  currentRegion: IConfigRegion | null;
  currentRealm: IClientRealm | null;
  userData: UserData;
  userPreferences: IFetchData<IPreferenceJson>;
  isLoginDialogOpen: boolean;
}

export interface IDispatchProps {
  changeIsLoginDialogOpen: (isLoginDialogOpen: boolean) => void;
  loadUserPreferences: (token: string) => void;
  insertToast: (toast: IToastProps) => void;
  loadRootEntrypoint: (payload: ILoadRootEntrypoint) => void;
}

export interface IOwnProps {
  viewport: ReactNode;
  rootEntrypointData?: ILoadRootEntrypoint;
}

export interface ICookieProps {
  cookies: Cookies;
}

export type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & ICookieProps>;

export class App extends React.Component<Props> {
  private static renderContent(content: ReactNode) {
    return (
      <>
        <TopbarRouteContainer />

        <div id="content">
          <PromptsRouteContainer />
          {content}
        </div>
      </>
    );
  }

  public componentDidMount(): void {
    const { loadRootEntrypoint, rootEntrypointData } = this.props;

    if (typeof rootEntrypointData === "undefined") {
      return;
    }

    loadRootEntrypoint(rootEntrypointData);
  }

  public componentDidUpdate(prevProps: Props): void {
    const { userData, insertToast, cookies } = this.props;

    switch (userData.authLevel) {
    case AuthLevel.unauthenticated:
      this.handleUnauth(prevProps);

      return;
    case AuthLevel.authenticated: {
      const hasBeenAuthorized = [AuthLevel.unauthenticated, AuthLevel.initial].includes(
        prevProps.userData.authLevel,
      );
      if (hasBeenAuthorized) {
        insertToast({
          icon: "user",
          intent: Intent.SUCCESS,
          message: "You are logged in.",
        });

        cookies.set("token", userData.profile.token, { path: "/" });
      }

      this.handleAuth(prevProps);

      return;
    }
    default:
      return;
    }
  }

  public render(): React.ReactNode {
    return (
      <div id="app" className={`${Classes.DARK} dark-app`}>
        {this.renderConnectedContent()}
      </div>
    );
  }

  private renderConnectedContent() {
    const { userData } = this.props;

    switch (userData.authLevel) {
    case AuthLevel.authenticated:
      return this.renderAuth();
    case AuthLevel.unauthenticated:
      return this.renderUnauth();
    case AuthLevel.initial:
    default:
      return App.renderContent(
        <NonIdealState
          title="Loading"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
        />,
      );
    }
  }

  private renderAuth() {
    const { bootData } = this.props;

    switch (bootData.level) {
    case FetchLevel.success:
      return this.renderBootAuth();
    case FetchLevel.fetching:
      return App.renderContent(
        <NonIdealState
          title="Loading"
          icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
        />,
      );
    case FetchLevel.failure:
      return App.renderContent(
        <NonIdealState
          title="Failed to load"
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />,
      );
    case FetchLevel.initial:
    default:
      return App.renderContent(
        <NonIdealState
          title="Loading"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
        />,
      );
    }
  }

  private renderBootAuth() {
    const { userPreferences } = this.props;

    switch (userPreferences.level) {
    case FetchLevel.fetching:
    case FetchLevel.refetching:
    case FetchLevel.prompted:
      return App.renderContent(
        <NonIdealState
          title="Loading"
          icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
        />,
      );
    case FetchLevel.success:
      return this.renderBootAuthWithPreferences();
    case FetchLevel.failure:
      return App.renderContent(
        <NonIdealState
          title="Failed to load user preferences."
          icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
        />,
      );
    case FetchLevel.initial:
    default:
      return App.renderContent(
        <NonIdealState
          title="Loading"
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
        />,
      );
    }
  }

  private renderBootAuthWithPreferences() {
    return App.renderContent(this.props.viewport);
  }

  private renderUnauth() {
    return App.renderContent(this.props.viewport);
  }

  private handleUnauth(prevProps: Props) {
    const {
      bootData,
      userData,
      changeIsLoginDialogOpen,
      isLoginDialogOpen,
      insertToast,
    } = this.props;

    switch (bootData.level) {
    case FetchLevel.failure:
      if (prevProps.bootData.level === FetchLevel.fetching) {
        insertToast({
          icon: "info-sign",
          intent: Intent.DANGER,
          message: "Failed to load regions.",
        });
      }

      return;
    case FetchLevel.success:
      if (prevProps.bootData.level === FetchLevel.fetching) {
        if (userData.preloadedToken !== null && userData.preloadedToken.length > 0) {
          insertToast({
            action: {
              icon: "log-in",
              intent: Intent.PRIMARY,
              onClick: () => changeIsLoginDialogOpen(!isLoginDialogOpen),
              text: "Login",
            },
            icon: "info-sign",
            intent: Intent.WARNING,
            message: "Your session has expired.",
            timeout: 10 * 1000,
          });
        }
      }

      return;
    default:
      return;
    }
  }

  private handleAuth(prevProps: Props) {
    const { loadUserPreferences, insertToast, userData, userPreferences } = this.props;

    if (userData.authLevel !== AuthLevel.authenticated) {
      return;
    }

    switch (userPreferences.level) {
    case FetchLevel.initial:
      loadUserPreferences(userData.profile.token);

      return;
    case FetchLevel.failure:
      if (prevProps.userPreferences.level === FetchLevel.fetching) {
        insertToast({
          icon: "warning-sign",
          intent: Intent.DANGER,
          message: "Failed to load user preferences.",
        });
      }

      return;
    case FetchLevel.success:
      this.handleAuthWithPreferences(prevProps);

      return;
    default:
      return;
    }
  }

  private handleAuthWithPreferences(prevProps: Props) {
    const { bootData, insertToast } = this.props;

    switch (bootData.level) {
    case FetchLevel.failure:
      if (prevProps.bootData.level === FetchLevel.fetching) {
        insertToast({
          icon: "info-sign",
          intent: Intent.DANGER,
          message: "Failed to load regions.",
        });
      }

      return;
    case FetchLevel.success:
    default:
      return;
    }
  }
}

export const AppWithCookies = withCookies(App);
