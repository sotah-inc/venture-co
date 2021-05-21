import React, { ReactNode } from "react";

import { Classes, Intent, IToastProps, NonIdealState, Spinner } from "@blueprintjs/core";
import { IPreferenceJson, IRegionComposite } from "@sotah-inc/core";
import { Cookies, withCookies } from "react-cookie";

import { ILoadRootEntrypoint } from "../actions/main";
import { PromptsRouteContainer } from "../route-containers/App/Prompts";
import { TopbarRouteContainer } from "../route-containers/App/Topbar";
import { IClientRealm, IProfile } from "../types/global";
import { AuthLevel, FetchLevel } from "../types/main";

export interface IStateProps {
  fetchPingLevel: FetchLevel;
  currentRegion: IRegionComposite | null;
  fetchRealmLevel: FetchLevel;
  currentRealm: IClientRealm | null;
  preloadedToken: string;
  authLevel: AuthLevel;
  isLoginDialogOpen: boolean;
  fetchUserPreferencesLevel: FetchLevel;
  userPreferences: IPreferenceJson | null;
  profile: IProfile | null;
  fetchBootLevel: FetchLevel;
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
    const { fetchPingLevel, insertToast } = this.props;

    switch (fetchPingLevel) {
    case FetchLevel.failure:
      if (prevProps.fetchPingLevel === FetchLevel.fetching) {
        insertToast({
          icon: "warning-sign",
          intent: Intent.DANGER,
          message: "Could not connect to Sotah API.",
        });
      }

      return;
    case FetchLevel.success:
      if (prevProps.fetchPingLevel === FetchLevel.fetching) {
        insertToast({
          icon: "info-sign",
          intent: Intent.SUCCESS,
          message: "Connected to Sotah API.",
        });
      }

      this.handleConnected(prevProps);

      return;
    default:
      return;
    }
  }

  public render(): React.ReactNode {
    const { fetchPingLevel } = this.props;
    switch (fetchPingLevel) {
    case FetchLevel.initial:
      return <>Welcome!</>;
    case FetchLevel.fetching:
      return <>Connecting...</>;
    case FetchLevel.failure:
      return <>Could not connect!</>;
    case FetchLevel.success:
      return this.renderConnected();
    default:
      return <>You should never see this!</>;
    }
  }

  private renderConnected() {
    return (
      <div id="app" className={`${Classes.DARK} dark-app`}>
        {this.renderConnectedContent()}
      </div>
    );
  }

  private renderConnectedContent() {
    const { authLevel } = this.props;

    switch (authLevel) {
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
    const { fetchBootLevel } = this.props;

    switch (fetchBootLevel) {
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
    const { fetchUserPreferencesLevel } = this.props;

    switch (fetchUserPreferencesLevel) {
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

  private handleConnected(prevProps: Props) {
    const {
      authLevel,
      insertToast,
      profile,
      cookies,
    } = this.props;

    switch (authLevel) {
    case AuthLevel.unauthenticated:
      this.handleUnauth(prevProps);

      return;
    case AuthLevel.authenticated: {
      const hasBeenAuthorized =
          [AuthLevel.unauthenticated, AuthLevel.initial].indexOf(prevProps.authLevel) > -1;
      if (hasBeenAuthorized) {
        insertToast({
          icon: "user",
          intent: Intent.SUCCESS,
          message: "You are logged in.",
        });

        if (profile !== null) {
          cookies.set("token", profile.token, { path: "/" });
        }
      }

      this.handleAuth(prevProps);

      return;
    }
    default:
      return;
    }
  }

  private handleUnauth(prevProps: Props) {
    const {
      fetchBootLevel,
      preloadedToken,
      changeIsLoginDialogOpen,
      isLoginDialogOpen,
      insertToast,
    } = this.props;

    switch (fetchBootLevel) {
    case FetchLevel.failure:
      if (prevProps.fetchBootLevel === FetchLevel.fetching) {
        insertToast({
          icon: "info-sign",
          intent: Intent.DANGER,
          message: "Failed to load regions.",
        });
      }

      return;
    case FetchLevel.success:
      if (prevProps.fetchBootLevel === FetchLevel.fetching) {
        if (preloadedToken.length > 0) {
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
    const { fetchUserPreferencesLevel, loadUserPreferences, profile, insertToast } = this.props;

    if (profile === null) {
      return;
    }

    switch (fetchUserPreferencesLevel) {
    case FetchLevel.initial:
      loadUserPreferences(profile.token);

      return;
    case FetchLevel.failure:
      if (prevProps.fetchUserPreferencesLevel === FetchLevel.fetching) {
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
    const { fetchBootLevel, insertToast } = this.props;

    switch (fetchBootLevel) {
    case FetchLevel.failure:
      if (prevProps.fetchBootLevel === FetchLevel.fetching) {
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