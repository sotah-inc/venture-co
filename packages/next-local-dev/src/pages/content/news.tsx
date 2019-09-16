import React from "react";

import { defaultState } from "@sotah-inc/client";
import { ReceiveGetBoot } from "@sotah-inc/client/build/dist/actions/main";
import { handlers } from "@sotah-inc/client/build/dist/reducers/handlers";
import { NewsRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Content/News";
import { defaultMainState } from "@sotah-inc/client/build/dist/types";
import { code } from "@sotah-inc/server";
import { IGetBootResponse } from "@sotah-inc/server/build/dist/messenger/contracts";

import { Layout } from "../../components/Layout";
import { getMessengerClient } from "../../lib";

interface IInitialProps {
  boot: IGetBootResponse | null;
}

export function Content({ boot }: IInitialProps) {
  return (
    <Layout
      title="Secrets of the Auction House"
      predefinedState={{
        ...defaultState,
        Main: handlers.main["boot"]["get"]["receive"](defaultMainState, ReceiveGetBoot(boot)),
      }}
    >
      <NewsRouteContainer />
    </Layout>
  );
}

Content.getInitialProps = async (): Promise<IInitialProps> => {
  const msg = await (await getMessengerClient()).getBoot();
  if (msg.code !== code.ok) {
    return { boot: null };
  }

  return { boot: msg.data };
};

export default Content;
