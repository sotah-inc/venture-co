import React from "react";

import { NewsRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Content/News";

import { Layout } from "../../components/Layout";

export function Content() {
  return (
    <Layout title="Secrets of the Auction House">
      <NewsRouteContainer />
    </Layout>
  );
}

export default Content;
