import * as React from "react";

import { Classes, Intent, NonIdealState, Spinner } from "@blueprintjs/core";

import { IPreferenceJson } from "../api-types/entities";
import { IRealm, IRegion } from "../api-types/region";
import { TopbarRouteContainer } from "../route-containers/App/Topbar";
import { ViewportRouteContainer } from "../route-containers/App/Viewport";
import { IProfile } from "../types/global";
import { AuthLevel, FetchLevel } from "../types/main";
import { GetAppToaster } from "../util/toasters";

export interface IStateProps {
  fetchPingLevel: FetchLevel;
  currentRegion: IRegion | null;
  fetchRealmLevel: FetchLevel;
  currentRealm: IRealm | null;
  preloadedToken: string;
  authLevel: AuthLevel;
  isLoginDialogOpen: boolean;
  fetchUserPreferencesLevel: FetchLevel;
  userPreferences: IPreferenceJson | null;
  profile: IProfile | null;
  fetchBootLevel: FetchLevel;
}

export interface IDispatchProps {
  onLoad: () => void;
  reloadUser: (token: string) => void;
  changeIsLoginDialogOpen: (isLoginDialogOpen: boolean) => void;
  loadUserPreferences: (token: string) => void;
  changeAuthLevel: (authLevel: AuthLevel) => void;
  boot: () => void;
}

export type Props = Readonly<IStateProps & IDispatchProps>;

export class App extends React.Component<Props> {
  public didHandleUnauth: boolean = false;

  public componentDidMount() {
    const { onLoad } = this.props;

    // checking access to api with ping endpoint
    onLoad();
  }

  public componentDidUpdate(prevProps: Props) {
    const { fetchPingLevel } = this.props;

    const AppToaster = GetAppToaster(true);

    switch (fetchPingLevel) {
      case FetchLevel.failure:
        if (prevProps.fetchPingLevel === FetchLevel.fetching) {
          if (AppToaster !== null) {
            AppToaster.show({
              icon: "warning-sign",
              intent: Intent.DANGER,
              message: "Could not connect to Sotah API.",
            });
          }
        }

        return;
      case FetchLevel.success:
        if (prevProps.fetchPingLevel === FetchLevel.fetching) {
          if (AppToaster !== null) {
            AppToaster.show({
              icon: "info-sign",
              intent: Intent.SUCCESS,
              message: "Connected to Sotah API.",
            });
          }
        }

        this.handleConnected(prevProps);

        return;
      default:
        return;
    }
  }

  public render() {
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
        return (
          <NonIdealState
            title="Loading"
            icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
          />
        );
    }
  }

  private renderAuth() {
    const { fetchBootLevel } = this.props;

    switch (fetchBootLevel) {
      case FetchLevel.success:
        return this.renderBootAuth();
      case FetchLevel.fetching:
        return (
          <NonIdealState
            title="Loading"
            icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
          />
        );
      case FetchLevel.failure:
        return (
          <NonIdealState
            title="Failed to load"
            icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
          />
        );
      case FetchLevel.initial:
      default:
        return (
          <NonIdealState
            title="Loading"
            icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
          />
        );
    }
  }

  private renderBootAuth() {
    const { fetchUserPreferencesLevel } = this.props;

    switch (fetchUserPreferencesLevel) {
      case FetchLevel.fetching:
      case FetchLevel.refetching:
      case FetchLevel.prompted:
        return (
          <NonIdealState
            title="Loading"
            icon={<Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />}
          />
        );
      case FetchLevel.success:
        return this.renderBootAuthWithPreferences();
      case FetchLevel.failure:
        return (
          <NonIdealState
            title="Failed to load user preferences."
            icon={<Spinner className={Classes.LARGE} intent={Intent.DANGER} value={1} />}
          />
        );
      case FetchLevel.initial:
      default:
        return (
          <NonIdealState
            title="Loading"
            icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} value={0} />}
          />
        );
    }
  }

  private renderBootAuthWithPreferences() {
    return (
      <>
        <TopbarRouteContainer />
        <ViewportRouteContainer />
      </>
    );
  }

  private renderUnauth() {
    return (
      <>
        <TopbarRouteContainer />
        <ViewportRouteContainer />
      </>
    );
  }

  private handleConnected(prevProps: Props) {
    const { authLevel, preloadedToken, changeAuthLevel, reloadUser } = this.props;

    switch (authLevel) {
      case AuthLevel.unauthenticated:
        this.handleUnauth(prevProps);

        return;
      case AuthLevel.authenticated:
        const hasBeenAuthorized =
          [AuthLevel.unauthenticated, AuthLevel.initial].indexOf(prevProps.authLevel) > -1;
        if (hasBeenAuthorized) {
          const AppToaster = GetAppToaster(true);
          if (AppToaster !== null) {
            AppToaster.show({
              icon: "user",
              intent: Intent.SUCCESS,
              message: "You are logged in.",
            });
          }
        }

        this.handleAuth(prevProps);

        return;
      case AuthLevel.initial:
        if (preloadedToken.length === 0) {
          changeAuthLevel(AuthLevel.unauthenticated);

          return;
        }

        reloadUser(preloadedToken);

        return;
      default:
        return;
    }
  }

  private handleUnauth(prevProps: Props) {
    const {
      fetchBootLevel,
      boot,
      preloadedToken,
      changeIsLoginDialogOpen,
      isLoginDialogOpen,
    } = this.props;

    const AppToaster = GetAppToaster(true);

    switch (fetchBootLevel) {
      case FetchLevel.initial:
        boot();

        return;
      case FetchLevel.failure:
        if (prevProps.fetchBootLevel === FetchLevel.fetching) {
          if (AppToaster !== null) {
            AppToaster.show({
              icon: "info-sign",
              intent: Intent.DANGER,
              message: "Failed to load regions.",
            });
          }
        }

        return;
      case FetchLevel.success:
        if (prevProps.fetchBootLevel === FetchLevel.fetching) {
          if (preloadedToken.length > 0) {
            if (AppToaster !== null) {
              AppToaster.show({
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
        }

        return;
      default:
        return;
    }
  }

  private handleAuth(prevProps: Props) {
    const { fetchUserPreferencesLevel, loadUserPreferences, profile } = this.props;

    const AppToaster = GetAppToaster(true);

    switch (fetchUserPreferencesLevel) {
      case FetchLevel.initial:
        loadUserPreferences(profile!.token);

        return;
      case FetchLevel.failure:
        if (prevProps.fetchUserPreferencesLevel === FetchLevel.fetching) {
          if (AppToaster !== null) {
            AppToaster.show({
              icon: "warning-sign",
              intent: Intent.DANGER,
              message: "Failed to load user preferences.",
            });
          }
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
    const { fetchBootLevel, boot } = this.props;

    const AppToaster = GetAppToaster(true);

    switch (fetchBootLevel) {
      case FetchLevel.initial:
        boot();

        return;
      case FetchLevel.failure:
        if (prevProps.fetchBootLevel === FetchLevel.fetching) {
          if (AppToaster !== null) {
            AppToaster.show({
              icon: "info-sign",
              intent: Intent.DANGER,
              message: "Failed to load regions.",
            });
          }
        }

        return;
      case FetchLevel.success:
      default:
        return;
    }
  }
}
