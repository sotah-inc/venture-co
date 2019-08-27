import * as React from "react";

import { setTitle } from "../../util";

export interface IRouteProps {
  browseToNews: () => void;
}

export type IOwnProps = IRouteProps;

export type Props = Readonly<IOwnProps>;

export class Content extends React.Component<Props> {
  public componentDidMount() {
    setTitle("Redirecting to News");
  }

  public render() {
    // props
    const { browseToNews } = this.props;

    browseToNews();

    return <p>Redirecting to News</p>;
  }
}
