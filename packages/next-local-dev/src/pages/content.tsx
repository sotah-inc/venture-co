import React from "react";

import { ContentRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Content";

import { Layout } from "../components/Layout";

export function Content() {
  return (
    <Layout title="Secrets of the Auction House">
      <ContentRouteContainer />
    </Layout>
  );
}

export default Content;
