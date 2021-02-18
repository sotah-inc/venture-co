import React, { ReactNode } from "react";

import { PromptsRouteContainer } from "../../route-containers/App/Prompts";

export interface IRouteProps {
  renderContent: () => ReactNode;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IOwnProps>;

export class Viewport extends React.Component<Props> {
  public render(): React.ReactNode {
    // props
    const { renderContent } = this.props;

    return (
      <div id="content">
        <PromptsRouteContainer />
        {renderContent()}
      </div>
    );
  }
}
