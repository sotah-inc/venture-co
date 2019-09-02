import * as React from "react";

import { Boot } from "@sotah-inc/client";
import Head from "next/head";

export function Sotah() {
  return (
    <>
      <Boot Viewport={<p>Hello, world!</p>} />
      <Head>
        <title>SotAH</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
    </>
  );
}

export default Sotah;
