/* tslint:disable:max-line-length */
import * as React from "react";

import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { NewsCreatorContainer } from "../../containers/App/Content/NewsCreator";
import { NewsEditorContainer } from "../../containers/App/Content/NewsEditor";
import { PostContainer } from "../../containers/App/Content/Post";
import { DataContainer } from "../../containers/App/Data";
import { AuctionsLandingRouteContainer } from "../../route-containers/App/AuctionsLanding";
import { ContentRouteContainer } from "../../route-containers/App/Content";
import { NewsRouteContainer } from "../../route-containers/App/Content/News";
import { AuctionListRouteContainer } from "../../route-containers/App/Data/AuctionList";
import { PriceListsRouteContainer } from "../../route-containers/App/Data/PriceLists";
import { RealmRouteContainer } from "../../route-containers/App/Data/Realm";
import { RegionRouteContainer } from "../../route-containers/App/Data/Region";
import { ProfessionsLandingRouteContainer } from "../../route-containers/App/ProfessionsLanding";
import { ProfileRouteContainer } from "../../route-containers/App/Profile";
import { ManageAccountRouteContainer } from "../../route-containers/App/Profile/ManageAccount";
import { PromptsRouteContainer } from "../../route-containers/App/Prompts";
import { RootRouteContainer } from "../../route-containers/App/Root";
import { NotFound } from "../util/NotFound";

export interface IOwnProps extends RouteComponentProps<{}> {}

export type Props = Readonly<IOwnProps>;

export class Viewport extends React.Component<Props> {
  public render() {
    return <div id="content">{this.renderContent()}</div>;
  }

  private renderContent() {
    return (
      <>
        <PromptsRouteContainer />
        <Switch>
          <Route exact={true} path="/" component={RootRouteContainer} />
          <Route exact={true} path="/profile" component={ProfileRouteContainer} />>
          <Route
            exact={true}
            path="/profile/manage-account"
            component={ManageAccountRouteContainer}
          />
          >
          <Route exact={true} path="/auctions" component={AuctionsLandingRouteContainer} />
          <Route exact={true} path="/price-lists" component={ProfessionsLandingRouteContainer} />
          <Route exact={true} path="/content" component={ContentRouteContainer} />
          <Route exact={true} path="/content/news" component={NewsRouteContainer} />
          <Route exact={true} path="/content/news/creator" component={NewsCreatorContainer} />
          <Route exact={true} path="/content/news/:post_slug" component={PostContainer} />
          <Route
            exact={true}
            path="/content/news/:post_slug/edit"
            component={NewsEditorContainer}
          />
          <Route exact={true} path="/data" component={DataContainer} />
          <Route
            exact={true}
            path="/data/auctions/:region_name"
            component={AuctionsLandingRouteContainer}
          />
          <Route
            exact={true}
            path="/data/professions/:region_name"
            component={ProfessionsLandingRouteContainer}
          />
          <Route exact={true} path="/data/:region_name" component={RegionRouteContainer} />
          <Route
            exact={true}
            path="/data/:region_name/:realm_slug"
            component={RealmRouteContainer}
          />
          <Route
            exact={true}
            path="/data/:region_name/:realm_slug/auctions"
            component={AuctionListRouteContainer}
          />
          <Route
            exact={true}
            path="/data/:region_name/:realm_slug/professions"
            component={PriceListsRouteContainer}
          />
          <Route
            exact={true}
            path="/data/:region_name/:realm_slug/professions/user/:pricelist_slug"
            component={PriceListsRouteContainer}
          />
          <Route
            exact={true}
            path="/data/:region_name/:realm_slug/professions/:profession_name"
            component={PriceListsRouteContainer}
          />
          <Route
            exact={true}
            path="/data/:region_name/:realm_slug/professions/:profession_name/:expansion_name"
            component={PriceListsRouteContainer}
          />
          <Route
            exact={true}
            path="/data/:region_name/:realm_slug/professions/:profession_name/:expansion_name/:pricelist_slug"
            component={PriceListsRouteContainer}
          />
          <Route component={NotFound} />
        </Switch>
      </>
    );
  }
}
