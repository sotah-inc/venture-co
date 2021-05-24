import React from "react";

import { ButtonGroup } from "@blueprintjs/core";
import { UserLevel } from "@sotah-inc/core";

import { LinkButtonRouteContainer } from "../../../route-containers/util/LinkButton";
import { AuthLevel, UserData } from "../../../types/main";
import { prefixActiveCheck } from "../../util/LinkButton";

export interface IStateProps {
  userData: UserData;
}

export interface IRouteProps {
  locationPathname: string;
}

export type Props = Readonly<IStateProps & IRouteProps>;

export class NewsButton extends React.Component<Props> {
  private static renderHomeButton() {
    return (
      <LinkButtonRouteContainer
        destination="/content/news"
        buttonProps={{ icon: "globe-network", text: "News", minimal: true }}
        resolveActive={prefixActiveCheck}
      />
    );
  }

  public render(): React.ReactNode {
    const { userData, locationPathname } = this.props;

    if (
      userData.authLevel !== AuthLevel.authenticated ||
      userData.profile.user.level < UserLevel.Admin
    ) {
      return NewsButton.renderHomeButton();
    }

    return (
      <ButtonGroup>
        {NewsButton.renderHomeButton()}
        <LinkButtonRouteContainer
          destination="/content/news/creator"
          buttonProps={{
            active: locationPathname.startsWith("/content/news"),
            icon: "plus",
            minimal: true,
          }}
        />
      </ButtonGroup>
    );
  }
}
