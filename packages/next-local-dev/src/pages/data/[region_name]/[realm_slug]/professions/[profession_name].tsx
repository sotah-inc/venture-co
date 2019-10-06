import React from "react";

import { LoadGetBoot } from "@sotah-inc/client/build/dist/actions/main";
import { ReceiveGetUnmetDemand } from "@sotah-inc/client/build/dist/actions/price-lists";
import { getBoot, getStatus } from "@sotah-inc/client/build/dist/api/data";
import {
  getUnmetDemand,
  IGetUnmetDemandResult,
} from "@sotah-inc/client/build/dist/api/price-lists";
import { runners } from "@sotah-inc/client/build/dist/reducers/handlers";
// tslint:disable-next-line:max-line-length
import { PriceListsRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Data/PriceLists";
import {
  defaultMainState,
  defaultPriceListsState,
  IStoreState,
} from "@sotah-inc/client/build/dist/types";
import { extractString, getPrimaryExpansion } from "@sotah-inc/client/build/dist/util";
import { IGetBootResponse, IStatusRealm, RealmSlug, RegionName } from "@sotah-inc/core";
import { NextPageContext } from "next";

import { Layout } from "../../../../../components/Layout";

interface IInitialProps {
  data?: {
    regionName: RegionName;
    realmSlug: RealmSlug;
    boot: IGetBootResponse | null;
    realms: IStatusRealm[] | null;
    unmetDemand: IGetUnmetDemandResult | null;
  };
}

export function ProfessionName({ data }: Readonly<IInitialProps>) {
  const predefinedState: Partial<IStoreState> | undefined = (() => {
    if (typeof data === "undefined") {
      return;
    }

    return {
      Main: runners.main(
        defaultMainState,
        LoadGetBoot({
          boot: data.boot,
          realmSlug: data.realmSlug,
          realms: data.realms,
          regionName: data.regionName,
        }),
      ),
      PriceLists: runners.pricelist(
        defaultPriceListsState,
        ReceiveGetUnmetDemand(data.unmetDemand),
      ),
    };
  })();

  return (
    <Layout title="Secrets of the Auction House" predefinedState={predefinedState}>
      <PriceListsRouteContainer />
    </Layout>
  );
}

ProfessionName.getInitialProps = async ({
  req,
  query,
}: NextPageContext): Promise<IInitialProps> => {
  if (typeof req === "undefined") {
    return {};
  }

  const regionName = extractString("region_name", query);
  const realmSlug = extractString("realm_slug", query);

  const [boot, realms] = await Promise.all([getBoot(), getStatus(regionName)]);

  const unmetDemand: IGetUnmetDemandResult | null = await (async () => {
    if (boot === null) {
      return null;
    }

    return getUnmetDemand({
      realm: realmSlug,
      region: regionName,
      request: {
        expansion: getPrimaryExpansion(boot.expansions).name,
      },
    });
  })();

  return {
    data: {
      boot,
      realmSlug,
      realms,
      regionName,
      unmetDemand,
    },
  };
};

export default ProfessionName;
