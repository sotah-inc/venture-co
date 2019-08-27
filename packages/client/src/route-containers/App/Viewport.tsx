/* tslint:disable:max-line-length */
import React from "react";

import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import { Viewport } from "../../components/App/Viewport";
import { NotFound } from "../../components/util/NotFound";
import { NewsCreatorContainer } from "../../containers/App/Content/NewsCreator";
import { NewsEditorContainer } from "../../containers/App/Content/NewsEditor";
import { PostContainer } from "../../containers/App/Content/Post";
import { AuctionsLandingRouteContainer } from "./AuctionsLanding";
import { ContentRouteContainer } from "./Content";
import { NewsRouteContainer } from "./Content/News";
import { DataRouteContainer } from "./Data";
import { AuctionListRouteContainer } from "./Data/AuctionList";
import { PriceListsRouteContainer } from "./Data/PriceLists";
import { RealmRouteContainer } from "./Data/Realm";
import { RegionRouteContainer } from "./Data/Region";
import { ProfessionsLandingRouteContainer } from "./ProfessionsLanding";
import { ProfileRouteContainer } from "./Profile";
import { ManageAccountRouteContainer } from "./Profile/ManageAccount";
import { RootRouteContainer } from "./Root";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer(_props: Props) {
  return (
    <Viewport
      renderContent={() => {
        return (
          <Switch>
            <Route exact={true} path="/" component={RootRouteContainer} />
            <Route exact={true} path="/profile" component={ProfileRouteContainer} />>
            <Route
              exact={true}
              path="/profile/manage-account"
              component={ManageAccountRouteContainer}
            />
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
            <Route exact={true} path="/data" component={DataRouteContainer} />
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
        );
      }}
    />
  );
}

export const ViewportRouteContainer = withRouter(RouteContainer);
