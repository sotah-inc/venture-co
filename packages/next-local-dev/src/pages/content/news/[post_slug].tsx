import { ReceiveGetPost } from "@sotah-inc/client/build/dist/actions/posts";
import React from "react";

import { ReceiveGetBoot, ReceiveGetPing } from "@sotah-inc/client/build/dist/actions/main";
import { getBoot } from "@sotah-inc/client/build/dist/api/data";
import { getPost } from "@sotah-inc/client/build/dist/api/posts";
import { runners } from "@sotah-inc/client/build/dist/reducers/handlers";
import { PostRouteContainer } from "@sotah-inc/client/build/dist/route-containers/App/Content/Post";
import {
  defaultMainState,
  defaultPostsState,
  IStoreState,
} from "@sotah-inc/client/build/dist/types";
import { extractString } from "@sotah-inc/client/build/dist/util";
import { IGetPostResponse } from "@sotah-inc/core";
import { IGetBootResponse } from "@sotah-inc/server/build/dist/messenger/contracts";
import { NextPageContext } from "next";

import { Layout } from "../../../components/Layout";

interface IInitialProps {
  data?: {
    boot: IGetBootResponse | null;
    post: IGetPostResponse | null;
  };
}

export function Creator({ data }: Readonly<IInitialProps>) {
  const predefinedState: Partial<IStoreState> | undefined = (() => {
    if (typeof data === "undefined") {
      return;
    }

    return {
      Main: runners.main(
        runners.main(defaultMainState, ReceiveGetPing(true)),
        ReceiveGetBoot(data.boot),
      ),
      Posts: runners.post(defaultPostsState, ReceiveGetPost(data.post)),
    };
  })();

  return (
    <Layout title="Secrets of the Auction House" predefinedState={predefinedState}>
      <PostRouteContainer />
    </Layout>
  );
}

Creator.getInitialProps = async ({ req, query }: NextPageContext): Promise<IInitialProps> => {
  if (typeof req === "undefined") {
    return {};
  }

  return {
    data: { boot: await getBoot(), post: await getPost(extractString("post_slug", query)) },
  };
};

export default Creator;
