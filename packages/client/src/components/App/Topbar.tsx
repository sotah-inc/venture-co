import React from "react";

import {
  Alignment,
  ButtonGroup,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
} from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { IExpansion, IConfigRegion, GameVersion } from "@sotah-inc/core";

import { LoginContainer } from "../../containers/App/Login";
import { RegisterContainer } from "../../containers/App/Register";
import { NewsButtonRouteContainer } from "../../route-containers/App/Topbar/NewsButton";
import { WorkOrdersButtonRouteContainer } from "../../route-containers/App/Topbar/WorkOrderButtons";
import { LinkButtonRouteContainer } from "../../route-containers/util/LinkButton";
import { VersionToggleRouteContainer } from "../../route-containers/util/VersionToggle";
import { IClientRealm } from "../../types/global";
import { AuthLevel, UserData } from "../../types/main";
import { toAuctions, toProfessionPricelist, toRealmProfessions } from "../../util";
import { prefixActiveCheck } from "../util/LinkButton";

export interface IStateProps {
  userData: UserData;
  currentGameVersion: GameVersion | null;
  currentRegion: IConfigRegion | null;
  currentRealm: IClientRealm | null;
  selectedExpansion: IExpansion | null;
}

export interface IRouteProps {
  locationPathname: string;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IStateProps & IOwnProps>;

enum SubBarKind {
  Unknown,
  Content,
  Data,
  Profile,
  Marketplace,
}

export class Topbar extends React.Component<Props> {
  public render(): React.ReactNode {
    const contentLink = (() => {
      const out = (
        <LinkButtonRouteContainer
          destination="/content"
          buttonProps={{ icon: "manually-entered-data", text: "Content" }}
          resolveActive={prefixActiveCheck}
        />
      );
      if (this.getSubBarKind() === SubBarKind.Content) {
        return out;
      }

      return (
        <Tooltip2 content="News, your personal feed" inheritDarkTheme={true}>
          {out}
        </Tooltip2>
      );
    })();
    const dataLink = (() => {
      const out = (
        <LinkButtonRouteContainer
          destination="/data"
          buttonProps={{ icon: "chart", text: "Data" }}
          resolveActive={(): boolean => this.getSubBarKind() === SubBarKind.Data}
        />
      );
      if (this.getSubBarKind() === SubBarKind.Data) {
        return out;
      }

      return (
        <Tooltip2 content="Auctions, professions" inheritDarkTheme={true}>
          {out}
        </Tooltip2>
      );
    })();
    const marketplaceLink = (() => {
      const out = (
        <LinkButtonRouteContainer
          destination="/marketplace"
          buttonProps={{ icon: "exchange", text: "Marketplace" }}
          resolveActive={prefixActiveCheck}
        />
      );
      if (this.getSubBarKind() === SubBarKind.Marketplace) {
        return out;
      }

      return (
        <Tooltip2 content="Work orders, cross-realm exchange" inheritDarkTheme={true}>
          {out}
        </Tooltip2>
      );
    })();

    return (
      <>
        <Navbar className={Classes.DARK}>
          <div id="topbar">
            <NavbarGroup align={Alignment.LEFT}>
              <LinkButtonRouteContainer
                destination={"/"}
                asDestination={"/"}
                buttonProps={{ icon: "globe", minimal: true, text: "SotAH" }}
              />
              <NavbarDivider />
              {contentLink}
              <NavbarDivider />
              {marketplaceLink}
              <NavbarDivider />
              {dataLink}
              <NavbarDivider />
              {this.renderUserInfo()}
            </NavbarGroup>
          </div>
        </Navbar>
        {this.renderSubBar()}
      </>
    );
  }

  private renderSubBar() {
    if (this.getSubBarKind() === SubBarKind.Unknown) {
      return null;
    }

    return (
      <Navbar className={Classes.DARK}>
        <div id="subbar">
          <NavbarGroup align={Alignment.LEFT}>{this.renderSubBarItems()}</NavbarGroup>
        </div>
      </Navbar>
    );
  }

  private getSubBarKind() {
    const { locationPathname } = this.props;

    if (locationPathname.startsWith("/content")) {
      return SubBarKind.Content;
    }

    const dataPrefixes = ["/profession-pricelists", "/auctions", "/professions"];
    if (dataPrefixes.some(v => locationPathname.startsWith(v))) {
      return SubBarKind.Data;
    }

    if (locationPathname.startsWith("/profile")) {
      return SubBarKind.Profile;
    }

    if (locationPathname.startsWith("/marketplace")) {
      return SubBarKind.Marketplace;
    }

    return SubBarKind.Unknown;
  }

  private renderSubBarItems() {
    switch (this.getSubBarKind()) {
    case SubBarKind.Content:
      return (
        <>
          <NewsButtonRouteContainer />
          <NavbarDivider />
          <LinkButtonRouteContainer
            destination="/content/getting-started"
            buttonProps={{ icon: "star", text: "Getting started", minimal: true }}
          />
          <NavbarDivider />
          <LinkButtonRouteContainer
            destination="/content/feed"
            buttonProps={{ icon: "feed", text: "Feed", minimal: true }}
          />
        </>
      );
    case SubBarKind.Data:
      return this.renderDataSubBar();
    case SubBarKind.Profile:
      return this.renderProfileSubBar();
    case SubBarKind.Marketplace:
      return <WorkOrdersButtonRouteContainer />;
    default:
      return null;
    }
  }

  private renderProfileSubBar() {
    return this.renderManageAccountButton();
  }

  private renderManageAccountButton() {
    const { userData } = this.props;

    if (userData.authLevel !== AuthLevel.authenticated) {
      return (
        <LinkButtonRouteContainer
          destination={""}
          buttonProps={{ icon: "cog", text: "Manage Account", minimal: true, disabled: true }}
        />
      );
    }

    return (
      <LinkButtonRouteContainer
        destination="/profile/manage-account"
        buttonProps={{ icon: "cog", text: "Manage Account", minimal: true }}
      />
    );
  }

  private renderDataSubBar() {
    return (
      <>
        {this.renderAuctionsButton()}
        <NavbarDivider />
        {this.renderProfessionsButton()}
        <NavbarDivider />
        {this.renderProfessionPricelistsButton()}
      </>
    );
  }

  private renderProfessionPricelistsButton() {
    const { currentGameVersion, currentRegion, currentRealm } = this.props;

    if (currentGameVersion === null || currentRegion === null || currentRealm === null) {
      return (
        <LinkButtonRouteContainer
          destination={""}
          buttonProps={{
            icon: "polygon-filter",
            minimal: true,
            text: "Profession Pricelists",
            disabled: true,
          }}
        />
      );
    }

    return (
      <VersionToggleRouteContainer
        buttonProps={{ icon: "polygon-filter", text: "Profession Pricelists", minimal: true }}
        resolveRouteConfig={toProfessionPricelist}
        exactOrPrefix={true}
      />
    );
  }

  private renderProfessionsButton() {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return (
        <LinkButtonRouteContainer
          buttonProps={{
            icon: "series-search",
            minimal: true,
            text: "Professions",
            disabled: true,
          }}
          destination={""}
        />
      );
    }

    const { asDest, url } = toRealmProfessions(currentRegion, currentRealm);

    return (
      <LinkButtonRouteContainer
        destination={`/${url}`}
        asDestination={`/${asDest}`}
        buttonProps={{
          icon: "series-search",
          minimal: true,
          text: "Professions",
        }}
        resolveActive={prefixActiveCheck}
      />
    );
  }

  private renderAuctionsButton() {
    const { currentGameVersion, currentRegion, currentRealm } = this.props;

    if (currentGameVersion === null || currentRegion === null || currentRealm === null) {
      const routeConfig = toAuctions(currentGameVersion, currentRegion, currentRealm);

      return (
        <LinkButtonRouteContainer
          destination={routeConfig.url}
          asDestination={routeConfig.asDest}
          buttonProps={{ icon: "dollar", text: "Auctions", minimal: true }}
        />
      );
    }

    return (
      <VersionToggleRouteContainer
        buttonProps={{ icon: "dollar", text: "Auctions", minimal: true }}
        resolveRouteConfig={toAuctions}
        exactOrPrefix={true}
      />
    );
  }

  private renderUserInfo() {
    const { userData } = this.props;
    if (userData.authLevel !== AuthLevel.authenticated) {
      return (
        <ButtonGroup>
          <RegisterContainer />
          <LoginContainer />
        </ButtonGroup>
      );
    }

    return (
      <LinkButtonRouteContainer
        destination="/profile"
        buttonProps={{ icon: "user", text: "Profile" }}
        resolveActive={prefixActiveCheck}
      />
    );
  }
}
