import React from "react";

import {
  Alignment,
  ButtonGroup,
  Classes,
  Icon,
  IconName,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Tooltip,
} from "@blueprintjs/core";
import { IExpansion, IRegionComposite, IStatusRealm, IUserJson } from "@sotah-inc/core";

import { LoginContainer } from "../../containers/App/Login";
import { RegisterContainer } from "../../containers/App/Register";
import { NewsButtonRouteContainer } from "../../route-containers/App/Topbar/NewsButton";
import { WorkOrdersButtonRouteContainer } from "../../route-containers/App/Topbar/WorkOrderButtons";
import { LinkButtonRouteContainer } from "../../route-containers/util/LinkButton";
import { getPrimaryExpansion } from "../../util";
import { toExpansion } from "../../util/routes";

export interface IStateProps {
  user: IUserJson | null;
  currentRealm: IStatusRealm | null;
  currentRegion: IRegionComposite | null;
  expansions: IExpansion[];
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
  public render() {
    const contentLink = (() => {
      const out = (
        <LinkButtonRouteContainer
          destination="/content"
          buttonProps={{ icon: "manually-entered-data", text: "Content" }}
          prefix={true}
        />
      );
      if (this.getSubBarKind() === SubBarKind.Content) {
        return out;
      }

      return (
        <Tooltip content="News, your personal feed" inheritDarkTheme={true}>
          {out}
        </Tooltip>
      );
    })();
    const dataLink = (() => {
      const out = (
        <LinkButtonRouteContainer
          destination="/data"
          buttonProps={{ icon: "chart", text: "Data" }}
          prefix={true}
        />
      );
      if (this.getSubBarKind() === SubBarKind.Data) {
        return out;
      }

      return (
        <Tooltip content="Auctions, professions" inheritDarkTheme={true}>
          {out}
        </Tooltip>
      );
    })();
    const marketplaceLink = (() => {
      const out = (
        <LinkButtonRouteContainer
          destination="/marketplace"
          buttonProps={{ icon: "exchange", text: "Marketplace" }}
          prefix={true}
        />
      );
      if (this.getSubBarKind() === SubBarKind.Marketplace) {
        return out;
      }

      return (
        <Tooltip content="Work orders, cross-realm exchange" inheritDarkTheme={true}>
          {out}
        </Tooltip>
      );
    })();

    return (
      <>
        <Navbar className={Classes.DARK}>
          <div id="topbar">
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading>
                <Icon icon="globe" />
                <span style={{ marginLeft: "5px" }}>SotAH</span>
              </NavbarHeading>
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

    if (locationPathname.startsWith("/data")) {
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
    const { user } = this.props;

    if (user === null) {
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
        {this.renderRegionRealmButton("/auctions", "dollar", "Auctions")}
        <NavbarDivider />
        {this.renderProfessionsButton()}
      </>
    );
  }

  private renderProfessionsButton() {
    const { expansions, currentRegion, currentRealm, selectedExpansion } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return null;
    }

    if (expansions.length === 0) {
      return (
        <LinkButtonRouteContainer
          destination={""}
          buttonProps={{
            disabled: true,
            icon: "polygon-filter",
            minimal: true,
            text: "Professions",
          }}
        />
      );
    }

    const foundExpansion =
      selectedExpansion === null ? getPrimaryExpansion(expansions) : selectedExpansion;

    const { asDest, url } = toExpansion(currentRegion, currentRealm, foundExpansion);

    return (
      <LinkButtonRouteContainer
        destination={`/${url}`}
        asDestination={`/${asDest}`}
        buttonProps={{
          icon: "polygon-filter",
          minimal: true,
          text: "Professions",
        }}
        prefix={true}
      />
    );
  }

  private renderRegionRealmButton(destination: string, icon: IconName, text: string) {
    const { currentRegion, currentRealm } = this.props;

    if (currentRegion === null || currentRealm === null) {
      return (
        <LinkButtonRouteContainer
          destination={""}
          buttonProps={{ icon, text, minimal: true, disabled: true }}
        />
      );
    }

    return (
      <LinkButtonRouteContainer
        destination={`/data/[region_name]/[realm_slug]${destination}`}
        asDestination={`/data/${currentRegion.config_region.name}/${currentRealm.slug}${destination}`}
        buttonProps={{ icon, text, minimal: true }}
      />
    );
  }

  private renderUserInfo() {
    const { user } = this.props;
    if (user === null) {
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
        prefix={true}
      />
    );
  }
}
