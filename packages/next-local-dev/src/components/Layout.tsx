import React, { ReactNode } from "react";

import { Boot } from "@sotah-inc/client";
import Head from "next/head";

interface IProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: Readonly<IProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Boot Viewport={children} />
    </>
  );
}
