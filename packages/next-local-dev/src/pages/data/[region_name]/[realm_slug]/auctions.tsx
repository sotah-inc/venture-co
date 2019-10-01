import React from "react";

import {
  ReceiveGetBoot,
  ReceiveGetPing,
  ReceiveGetRealms,
} from "@sotah-inc/client/build/dist/actions/main";
import { getBoot, getStatus } from "@sotah-inc/client/build/dist/api/data";
import { runners } from "@sotah-inc/client/build/dist/reducers/handlers";
// tslint:disable-next-line:max-line-length
import { AuctionListRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Data/AuctionList";
import { defaultMainState, IStoreState } from "@sotah-inc/client/build/dist/types";
import { extractString } from "@sotah-inc/client/build/dist/util";
import { IGetBootResponse, IStatusRealm } from "@sotah-inc/core";
import { NextPageContext } from "next";

import { Layout } from "../../../../components/Layout";

interface IInitialProps {
  data?: {
    boot: IGetBootResponse | null;
    realms: IStatusRealm[] | null;
  };
}

export function Auctions({ data }: Readonly<IInitialProps>) {
  const predefinedState: Partial<IStoreState> | undefined = (() => {
    if (typeof data === "undefined") {
      return;
    }

    return {
      Main: runners.main(
        runners.main(
          runners.main(defaultMainState, ReceiveGetPing(true)),
          ReceiveGetBoot(data.boot),
        ),
        ReceiveGetRealms(data.realms),
      ),
    };
  })();

  return (
    <Layout title="Secrets of the Auction House" predefinedState={predefinedState}>
      <AuctionListRouteContainer />
    </Layout>
  );
}

Auctions.getInitialProps = async ({ req, query }: NextPageContext): Promise<IInitialProps> => {
  if (typeof req === "undefined") {
    return {};
  }

  const [boot, realms] = await Promise.all([
    getBoot(),
    getStatus(extractString("region_name", query)),
  ]);

  return {
    data: {
      boot,
      realms,
    },
  };
};

export default Auctions;
