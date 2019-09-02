import React from "react";

import "@sotah-inc/client/build/styles/venture-co.min.css";
import App from "next/app";

class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default MyApp;
