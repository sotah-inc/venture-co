import React from "react";

import { ReceiveGetBoot, ReceiveGetPing } from "@sotah-inc/client/build/dist/actions/main";
import { getBoot } from "@sotah-inc/client/build/dist/api/data";
import { runners } from "@sotah-inc/client/build/dist/reducers/handlers";
import { DataRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Data";
import { defaultMainState, IStoreState } from "@sotah-inc/client/build/dist/types";
import { IGetBootResponse } from "@sotah-inc/core";
import { NextPageContext } from "next";

import { Layout } from "../components/Layout";

interface IInitialProps {
  data?: {
    boot: IGetBootResponse | null;
  };
}

export function Data({ data }: Readonly<IInitialProps>) {
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
      <DataRouteContainer />
    </Layout>
  );
}

Data.getInitialProps = async ({ req }: NextPageContext): Promise<IInitialProps> => {
  if (typeof req === "undefined") {
    return {};
  }

  return { data: { boot: await getBoot() } };
};

export default Data;
