import React from "react";

import { H1, H4, Icon, IconName } from "@blueprintjs/core";
import { GameVersion, IConfigRegion } from "@sotah-inc/core";

import { ILoadPostsEntrypoint } from "../../actions/posts";
import { AuctionStatsGraphContainer } from "../../containers/entry-point/News/AuctionStatsGraph";
import { TokenHistoryGraphContainer } from "../../containers/entry-point/News/TokenHistoryGraph";
import { DeletePostDialogRouteContainer } from "../../route-containers/entry-point/News/DeletePostDialog";
import { PostListRouteContainer } from "../../route-containers/entry-point/News/PostList";
import { IClientRealm } from "../../types/global";
import { AuthLevel, UserData } from "../../types/main";
import { setTitle, toAuctions } from "../../util";
import { CardCallout } from "../util";

export interface IStateProps {
  userData: UserData;
  currentGameVersion: GameVersion | null;
  currentRegion: IConfigRegion | null;
  currentRealm: IClientRealm | null;
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
  public componentDidMount(): void {
    const { entrypointData, loadEntrypointData } = this.props;

    setTitle("News");

    loadEntrypointData(entrypointData);
  }

  public render(): React.ReactNode {
    const { currentGameVersion, currentRegion, currentRealm } = this.props;

    const auctionsRouteConfig = toAuctions(currentGameVersion, currentRegion, currentRealm);

    return (
      <>
        <DeletePostDialogRouteContainer />
        <div className="pure-g">
          <div className="pure-u-3-4">
            <div style={{ marginRight: "15px" }}>
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
                    auctionsRouteConfig.url,
                    "dollar",
                    "Browse Auctions",
                    auctionsRouteConfig.asDest,
                  )}
                </div>
                <div className="pure-u-1-4 homepage-card-container">
                  {this.renderCard(
                    "/professions/[region_name]",
                    "chart",
                    "Discover Professions",
                    "/professions",
                  )}
                </div>
                {this.renderUserCallout()}
              </div>
              <PostListRouteContainer />
            </div>
          </div>
          <div className="pure-u-1-4">
            <H4>Token Price History</H4>
            <TokenHistoryGraphContainer />
            <hr />
            <H4>AH Valuation History</H4>
            <AuctionStatsGraphContainer />
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
    const { changeIsRegisterDialogOpen, userData } = this.props;

    if (userData.authLevel === AuthLevel.authenticated) {
      return (
        <div className="pure-u-1-4 homepage-card-container">
          {this.renderCard("/content/feed", "feed", "Check Your Feed")}
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
