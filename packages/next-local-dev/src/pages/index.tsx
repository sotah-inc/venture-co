import React from "react";

import { RootRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Root";

import { Layout } from "../components/Layout";

export function Home() {
  return (
    <Layout title="Secrets of the Auction House">
      <RootRouteContainer />
    </Layout>
  );
}

export default Home;
