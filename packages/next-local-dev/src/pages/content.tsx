import { ReceiveGetBoot, ReceiveGetPing } from "@sotah-inc/client/build/dist/actions/main";
import { getBoot } from "@sotah-inc/client/build/dist/api/data";
import { runners } from "@sotah-inc/client/build/dist/reducers/handlers";
import { ContentRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Content";
import { defaultMainState, IStoreState } from "@sotah-inc/client/build/dist/types";
import { IGetBootResponse } from "@sotah-inc/core";
import { NextPageContext } from "next";
import React from "react";

import { Layout } from "../components/Layout";

interface IInitialProps {
  data?: {
    boot: IGetBootResponse | null;
  };
}

export function Content({ data }: Readonly<IInitialProps>) {
  const predefinedState: Partial<IStoreState> | undefined = (() => {
    if (typeof data === "undefined") {
      return;
    }

    return {
      Main: runners.main(
        runners.main(defaultMainState, ReceiveGetPing(true)),
        ReceiveGetBoot(data.boot),
      ),
    };
  })();

  return (
    <Layout title="Secrets of the Auction House" predefinedState={predefinedState}>
      <ContentRouteContainer />
    </Layout>
  );
}

Content.getInitialProps = async ({ req }: NextPageContext): Promise<IInitialProps> => {
  if (typeof req === "undefined") {
    return {};
  }

  return { data: { boot: await getBoot() } };
};

export default Content;
