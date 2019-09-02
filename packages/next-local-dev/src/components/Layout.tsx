import React, { ReactNode } from "react";

import { Boot, defaultState } from "@sotah-inc/client";
import { defaultMainState, IStoreState } from "@sotah-inc/client/build/dist/types";
import { FetchLevel } from "@sotah-inc/client/build/dist/types/main";
import Head from "next/head";

interface IProps {
  children: ReactNode;
  title: string;
  predefinedState?: Partial<IStoreState>;
}

const defaultPredefinedState: IStoreState = {
  ...defaultState,
  Main: { ...defaultMainState, fetchPingLevel: FetchLevel.success },
};

export function Layout({ children, title, predefinedState }: Readonly<IProps>) {
  const bootPredefinedState =
    typeof predefinedState === "undefined"
      ? defaultPredefinedState
      : { ...defaultPredefinedState, ...predefinedState };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Boot viewport={children} predefinedState={bootPredefinedState} />
    </>
  );
}
