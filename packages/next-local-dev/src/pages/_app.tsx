import React from "react";

import App from "next/app";

import "./_app.css";

class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default MyApp;
