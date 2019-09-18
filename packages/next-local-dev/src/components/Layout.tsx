import React, { ReactNode } from "react";

import { Boot, defaultState } from "@sotah-inc/client";
import { IStoreState } from "@sotah-inc/client/build/dist/types";
import Head from "next/head";

interface IProps {
  children: ReactNode;
  title: string;
  predefinedState?: Partial<IStoreState>;
}

export function Layout({ children, title, predefinedState }: Readonly<IProps>) {
  const bootPredefinedState: IStoreState =
    typeof predefinedState === "undefined" ? defaultState : { ...defaultState, ...predefinedState };

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
