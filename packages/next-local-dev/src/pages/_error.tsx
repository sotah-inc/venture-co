import React from "react";

import { NotFound } from "@sotah-inc/client/build/dist/components/util/NotFound";
import HttpStatus from "http-status";
import { Layout } from "../components/Layout";

interface IOwnProps {
  statusCode?: number;
}

type Props = Readonly<IOwnProps>;

class Error extends React.Component<Props> {
  public static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  public render() {
    // props
    const { statusCode } = this.props;

    if (typeof statusCode === "undefined") {
      return (
        <Layout title="Secrets of the Auction House">
          <p>An error occurred!</p>
        </Layout>
      );
    }

    switch (statusCode) {
      case HttpStatus.NOT_FOUND:
        return (
          <Layout title="Secrets of the Auction House">
            <NotFound />
          </Layout>
        );
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return (
          <Layout title="Secrets of the Auction House">
            <p>An internal server error occurred!</p>
          </Layout>
        );
      default:
        return (
          <Layout title="Secrets of the Auction House">
            <p>An error {statusCode} occurred!</p>
          </Layout>
        );
    }
  }
}

export default Error;
