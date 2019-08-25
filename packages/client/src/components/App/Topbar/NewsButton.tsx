import * as React from "react";

import { ButtonGroup } from "@blueprintjs/core";

import { IUserJson, UserLevel } from "../../../api-types/entities";
import { LinkButtonRouteContainer } from "../../../route-containers/util/LinkButton";

export interface IStateProps {
  user: IUserJson | null;
}

export type Props = Readonly<IStateProps>;

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
    const { user } = this.props;

    if (user === null || user.level < UserLevel.Admin) {
      return NewsButton.renderHomeButton();
    }

    return (
      <ButtonGroup>
        {NewsButton.renderHomeButton()}
        <LinkButtonRouteContainer
          destination="/content/news/creator"
          buttonProps={{ icon: "plus", minimal: true }}
          prefix={true}
        />
      </ButtonGroup>
    );
  }
}
