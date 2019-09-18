import React from "react";

import { ReceiveGetBoot, ReceiveGetPing } from "@sotah-inc/client/build/dist/actions/main";
import { ReceiveGetPosts } from "@sotah-inc/client/build/dist/actions/posts";
import { getBoot, getPosts, IGetPostsResult } from "@sotah-inc/client/build/dist/api/data";
import { runners } from "@sotah-inc/client/build/dist/reducers/handlers";
import { NewsRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Content/News";
import {
  defaultMainState,
  defaultPostsState,
  IStoreState,
} from "@sotah-inc/client/build/dist/types";
import { IGetBootResponse } from "@sotah-inc/server/build/dist/messenger/contracts";
import { NextPageContext } from "next";

import { Layout } from "../../components/Layout";

interface IInitialProps {
  data?: {
    boot: IGetBootResponse | null;
    posts: IGetPostsResult | null;
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
      Posts: runners.post(defaultPostsState, ReceiveGetPosts(data.posts)),
    };
  })();

  return (
    <Layout title="Secrets of the Auction House" predefinedState={predefinedState}>
      <NewsRouteContainer />
    </Layout>
  );
}

Content.getInitialProps = async ({ req }: NextPageContext): Promise<IInitialProps> => {
  if (typeof req === "undefined") {
    return {};
  }

  return { data: { boot: await getBoot(), posts: await getPosts() } };
};

export default Content;
