import React from "react";
import type { AppProps } from "next/app";

import "../styles/globals.css";

const LiteGraphPlaygroundApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default LiteGraphPlaygroundApp;
