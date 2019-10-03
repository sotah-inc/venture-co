import React from "react";

import {
  ReceiveAuctions,
  ReceiveAuctionsQuery,
} from "@sotah-inc/client/build/dist/actions/auction";
import { LoadGetBoot, ReceiveGetPing } from "@sotah-inc/client/build/dist/actions/main";
import {
  getAuctions,
  getBoot,
  getStatus,
  queryAuctions,
} from "@sotah-inc/client/build/dist/api/data";
import { auction } from "@sotah-inc/client/build/dist/reducers/auction";
import { runners } from "@sotah-inc/client/build/dist/reducers/handlers";
// tslint:disable-next-line:max-line-length
import { AuctionListRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Data/AuctionList";
import {
  defaultAuctionState,
  defaultMainState,
  IStoreState,
} from "@sotah-inc/client/build/dist/types";
import { extractString } from "@sotah-inc/client/build/dist/util";
import {
  IGetAuctionsResponse,
  IGetBootResponse,
  IQueryAuctionsResponse,
  IStatusRealm,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import { NextPageContext } from "next";

import { Layout } from "../../../../components/Layout";

interface IInitialProps {
  data?: {
    regionName: RegionName;
    realmSlug: RealmSlug;
    boot: IGetBootResponse | null;
    realms: IStatusRealm[] | null;
    queryAuctionsResults: IQueryAuctionsResponse | null;
    auctions: IGetAuctionsResponse | null;
  };
}

export function Auctions({ data }: Readonly<IInitialProps>) {
  const predefinedState: Partial<IStoreState> | undefined = (() => {
    if (typeof data === "undefined") {
      return;
    }

    return {
      Auction: auction(
        auction(defaultAuctionState, ReceiveAuctionsQuery(data.queryAuctionsResults)),
        ReceiveAuctions(data.auctions),
      ),
      Main: runners.main(
        runners.main(defaultMainState, ReceiveGetPing(true)),
        LoadGetBoot({
          boot: data.boot,
          realmSlug: data.realmSlug,
          realms: data.realms,
          regionName: data.regionName,
        }),
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

  const regionName = extractString("region_name", query);
  const realmSlug = extractString("realm_slug", query);

  const [boot, realms, auctions, queryAuctionsResults] = await Promise.all([
    getBoot(),
    getStatus(regionName),
    getAuctions({
      realmSlug,
      regionName,
      request: {
        count: defaultAuctionState.auctionsPerPage,
        itemFilters: [],
        ownerFilters: [],
        page: defaultAuctionState.currentPage,
        sortDirection: defaultAuctionState.sortDirection,
        sortKind: defaultAuctionState.sortKind,
      },
    }),
    queryAuctions({
      query: "",
      realmSlug,
      regionName,
    }),
  ]);

  return {
    data: {
      auctions,
      boot,
      queryAuctionsResults,
      realmSlug,
      realms,
      regionName,
    },
  };
};

export default Auctions;
