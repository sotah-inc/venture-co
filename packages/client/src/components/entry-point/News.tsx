import React from "react";

import { Classes, H1, H4, Icon, IconName, Intent, NonIdealState, Spinner } from "@blueprintjs/core";
import { IRegionComposite } from "@sotah-inc/core";

import { ILoadPostsEntrypoint } from "../../actions/posts";
import { AuctionStatsGraphContainer } from "../../containers/entry-point/News/AuctionStatsGraph";
import { TokenHistoryGraphContainer } from "../../containers/entry-point/News/TokenHistoryGraph";
// tslint:disable-next-line:max-line-length
import { DeletePostDialogRouteContainer } from "../../route-containers/entry-point/News/DeletePostDialog";
import { PostListRouteContainer } from "../../route-containers/entry-point/News/PostList";
import { AuthLevel } from "../../types/main";
import { setTitle } from "../../util";
import { CardCallout } from "../util";

export interface IStateProps {
  currentRegion: IRegionComposite | null;
  authLevel: AuthLevel;
}

export interface IDispatchProps {
  changeIsRegisterDialogOpen: (isOpen: boolean) => void;
  loadEntrypointData: (payload: ILoadPostsEntrypoint) => void;
}

export interface IOwnProps {
  entrypointData: ILoadPostsEntrypoint;
}

export interface IRouteProps {
  historyPush: (destination: string, asDest?: string) => void;
}

type Props = Readonly<IStateProps & IDispatchProps & IOwnProps & IRouteProps>;

export class News extends React.Component<Props> {
  public componentDidMount() {
    const { entrypointData, loadEntrypointData } = this.props;

    setTitle("News");

    loadEntrypointData(entrypointData);
  }

  public componentDidUpdate(prevProps: Props) {
    const { entrypointData, loadEntrypointData } = this.props;

    if (entrypointData.loadId !== prevProps.entrypointData.loadId) {
      setTitle("News");

      loadEntrypointData(entrypointData);

      return;
    }
  }

  public render() {
    const { currentRegion } = this.props;

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
                  "/data/auctions/[region_name]",
                  "dollar",
                  "Browse Auctions",
                  `/data/auctions/${currentRegion.config_region.name}`,
                )}
              </div>
              <div className="pure-u-1-4 homepage-card-container">
                {this.renderCard(
                  "/data/professions/[region_name]",
                  "chart",
                  "Discover Professions",
                  `/data/professions/${currentRegion.config_region.name}`,
                )}
              </div>
              {this.renderUserCallout()}
            </div>
            <PostListRouteContainer />
          </div>
          <div className="pure-u-1-4">
            <div style={{ marginLeft: "5px" }}>
              <H4>Token Price History</H4>
              <TokenHistoryGraphContainer />
              <hr />
              <H4>AH Valuation History</H4>
              <AuctionStatsGraphContainer />
            </div>
          </div>
        </div>
      </>
    );
  }

  private renderCard(dest: string, icon: IconName, label: string, asDest?: string) {
    const { historyPush } = this.props;

    return <CardCallout onClick={() => historyPush(dest, asDest)} icon={icon} label={label} />;
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
