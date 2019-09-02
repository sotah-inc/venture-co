import React from "react";

import Link from "next/link";

import { Layout } from "../components/Layout";

export function Home() {
  return (
    <Layout>
      <div className="row">
        <a className="card" href="https://github.com/zeit/next.js#setup">
          <h3>Getting Started &rarr;</h3>
          <p>Learn more about Next.js on GitHub and in their examples.</p>
        </a>
        <a className="card" href="https://github.com/zeit/next.js/tree/master/examples">
          <h3>Examples &rarr;</h3>
          <p>Find other example boilerplates on the Next.js GitHub.</p>
        </a>
        <a className="card" href="https://github.com/zeit/next.js">
          <h3>Create Next App &rarr;</h3>
          <p>Was this tool helpful? Let us know how we can improve it!</p>
        </a>
      </div>
      <div className="row">
        <Link href="/post/[pid]" as="/post/wew-lad">
          <a className="card">
            <h3>Wew lad</h3>
            <p>El oh el</p>
          </a>
        </Link>
        <Link href="/sotah" as="/sotah">
          <a className="card">
            <h3>SotAH</h3>
            <p>SotAH</p>
          </a>
        </Link>
      </div>
    </Layout>
  );
}

export default Home;
