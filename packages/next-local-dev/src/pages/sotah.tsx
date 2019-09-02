import * as React from "react";

import { Boot } from "@sotah-inc/client";
import "@sotah-inc/client/build/styles/venture-co.min.css";
import Head from "next/head";

export function Sotah() {
  return (
    <div>
      <Boot />
      <Head>
        <title>SotAH</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
    </div>
  );
}

export default Sotah;
