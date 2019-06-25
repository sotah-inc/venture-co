import * as React from "react";

import { Redirect, RouteComponentProps } from "react-router-dom";

export interface IOwnProps extends RouteComponentProps<{}> {}

export type Props = Readonly<IOwnProps>;

export class Root extends React.Component<Props> {
    public render() {
        return <Redirect to="/content" />;
    }
}
