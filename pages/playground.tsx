import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import Playground from "../components/page/playground";

const PlaygroundPage: NextPage = () => {
  const { basePath } = useRouter();

  return (
    <>
      <Head>
        <title>LiteGraph Playground</title>
        <meta name="description" content="A LiteGraph Playground" />
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </Head>
      <Playground />
    </>
  );
};

export default PlaygroundPage;
