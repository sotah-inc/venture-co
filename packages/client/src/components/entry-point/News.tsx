import React from "react";

import { Classes, H1, H4, Icon, IconName, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IRegion } from "@sotah-inc/core";

import { ILoadRootEntrypoint } from "../../actions/main";
// tslint:disable-next-line:max-line-length
import { DeletePostDialogRouteContainer } from "../../route-containers/App/Content/DeletePostDialog";
import { PostListRouteContainer } from "../../route-containers/App/Content/PostList";
import { AuthLevel, FetchLevel } from "../../types/main";
import { setTitle } from "../../util";
import { CardCallout } from "../util";

export interface IStateProps {
  currentRegion: IRegion | null;
  authLevel: AuthLevel;
  fetchPingLevel: FetchLevel;
  fetchBootLevel: FetchLevel;
}

export interface IDispatchProps {
  changeIsRegisterDialogOpen: (isOpen: boolean) => void;
  loadRootEntrypoint: (payload?: ILoadRootEntrypoint) => void;
}

export interface IRouteProps {
  historyPush: (destination: string) => void;
}

export interface IOwnProps {
  rootEntrypointData?: ILoadRootEntrypoint;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class News extends React.Component<Props> {
  public componentDidMount() {
    const { fetchBootLevel, fetchPingLevel, loadRootEntrypoint, rootEntrypointData } = this.props;

    if (fetchPingLevel === FetchLevel.success && fetchBootLevel === FetchLevel.success) {
      setTitle("News");

      return;
    }

    const shouldLoad =
      fetchPingLevel === FetchLevel.initial && fetchBootLevel === FetchLevel.initial;
    if (shouldLoad && typeof rootEntrypointData !== "undefined") {
      loadRootEntrypoint(rootEntrypointData);

      return;
    }
  }

  public componentDidUpdate(_prevProps: Props) {
    const { fetchBootLevel, fetchPingLevel } = this.props;

    if (fetchPingLevel === FetchLevel.success && fetchBootLevel === FetchLevel.success) {
      setTitle("News");

      return;
    }
  }

  public render() {
    const { currentRegion, fetchPingLevel, fetchBootLevel } = this.props;

    if (fetchPingLevel !== FetchLevel.success) {
      return (
        <NonIdealState
          title="Connecting..."
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
        />
      );
    }

    if (fetchBootLevel !== FetchLevel.success) {
      return (
        <NonIdealState
          title="Booting..."
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
        />
      );
    }

    if (currentRegion === null) {
      return (
        <NonIdealState
          title="Loading region..."
          icon={<Spinner className={Classes.LARGE} intent={Intent.NONE} />}
        />
      );
    }

    return (
      <>
        <DeletePostDialogRouteContainer />
        <div className="pure-g">
          <div className="pure-u-3-4">
            <H1>
              <Icon icon="globe" iconSize={35} /> Secrets of the Auction House
            </H1>
            <H4>
              SotAH is a full-featured technical analysis application for the World of Warcraft
              Auction House.
            </H4>
            <p>It is optimized for users comparing markets and discovering competitors.</p>
            <div className="welcome pure-g">
              <div className="pure-u-1-4 homepage-card-container">
                {this.renderCard("/content/getting-started", "star", "Getting Started")}
              </div>
              <div className="pure-u-1-4 homepage-card-container">
                {this.renderCard(
                  `/data/auctions/${currentRegion.name}`,
                  "dollar",
                  "Browse Auctions",
                )}
              </div>
              <div className="pure-u-1-4 homepage-card-container">
                {this.renderCard(
                  `/data/professions/${currentRegion.name}`,
                  "chart",
                  "Discover Professions",
                )}
              </div>
              {this.renderUserCallout()}
            </div>
            <PostListRouteContainer />
          </div>
          <div className="pure-u-1-4">&nbsp;</div>
        </div>
      </>
    );
  }

  private renderCard(dest: string, icon: IconName, label: string) {
    const { historyPush } = this.props;

    return <CardCallout onClick={() => historyPush(dest)} icon={icon} label={label} />;
  }

  private renderUserCallout() {
    const { changeIsRegisterDialogOpen, authLevel } = this.props;

    if (authLevel === AuthLevel.authenticated) {
      return (
        <div className="pure-u-1-4 homepage-card-container">
          {this.renderCard(`/content/feed`, "feed", "Check Your Feed")}
        </div>
      );
    }

    return (
      <div className="pure-u-1-4 homepage-card-container">
        <CardCallout
          onClick={() => changeIsRegisterDialogOpen(true)}
          icon="user"
          label="Create Account"
        />
      </div>
    );
  }
}
