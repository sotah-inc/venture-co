import React from "react";

import { defaultState } from "@sotah-inc/client";
import { defaultMainState } from "@sotah-inc/client/build/dist/types";
import { FetchLevel } from "@sotah-inc/client/build/dist/types/main";
import { Layout } from "../components/Layout";

export function Home() {
  return (
    <Layout
      title="Secrets of the Auction House"
      predefinedState={{
        ...defaultState,
        Main: { ...defaultMainState, fetchPingLevel: FetchLevel.success },
      }}
    >
      <p>Hello, world!</p>
    </Layout>
  );
}

export default Home;
