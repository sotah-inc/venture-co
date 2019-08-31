import * as React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { Layout } from "../../components/Layout";

type Props = Readonly<WithRouterProps>;

const View = ({ router }: Props) => {
  return (
    <Layout>
      <p>Hello, world! {router.query["pid"]}</p>
    </Layout>
  );
};

export default withRouter(View);
