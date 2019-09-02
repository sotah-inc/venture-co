import React from "react";

import { Classes } from "@blueprintjs/core";
import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  public static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  public render() {
    return (
      <Html lang="en">
        <Head />
        <body className={Classes.DARK}>
          <div id="root">
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
