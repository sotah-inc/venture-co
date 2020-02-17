import React from "react";

import { ButtonGroup } from "@blueprintjs/core";
import { IUserJson, UserLevel } from "@sotah-inc/core";

import { LinkButtonRouteContainer } from "../../../route-containers/util/LinkButton";

export interface IStateProps {
  user: IUserJson | null;
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
        prefix={true}
      />
    );
  }

  public render() {
    const { user, locationPathname } = this.props;

    if (user === null || user.level < UserLevel.Admin) {
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
