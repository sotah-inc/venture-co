import React from "react";

import { defaultState } from "@sotah-inc/client";
import { ContentRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Content";
import { defaultMainState } from "@sotah-inc/client/build/dist/types";
import { FetchLevel } from "@sotah-inc/client/build/dist/types/main";

import { Layout } from "../components/Layout";

export function Content() {
  return (
    <Layout
      title="Secrets of the Auction House"
      predefinedState={{
        ...defaultState,
        Main: { ...defaultMainState, fetchPingLevel: FetchLevel.success },
      }}
    >
      <ContentRouteContainer />
    </Layout>
  );
}

export default Content;
