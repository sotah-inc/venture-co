import React from "react";

import { defaultState } from "@sotah-inc/client";
import { ReceiveGetBoot, ReceiveGetPing } from "@sotah-inc/client/build/dist/actions/main";
import { getBoot } from "@sotah-inc/client/build/dist/api/data";
import { runners } from "@sotah-inc/client/build/dist/reducers/handlers";
import { ContentRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Content";
import { defaultMainState } from "@sotah-inc/client/build/dist/types";
import { IGetBootResponse } from "@sotah-inc/core";

import { Layout } from "../components/Layout";

interface IInitialProps {
  boot: IGetBootResponse | null;
}

export function Content({ boot }: IInitialProps) {
  return (
    <Layout
      title="Secrets of the Auction House"
      predefinedState={{
        ...defaultState,
        Main: runners.main(
          runners.main(defaultMainState, ReceiveGetPing(true)),
          ReceiveGetBoot(boot),
        ),
      }}
    >
      <ContentRouteContainer />
    </Layout>
  );
}

Content.getInitialProps = async (): Promise<IInitialProps> => {
  return { boot: await getBoot() };
};

export default Content;
