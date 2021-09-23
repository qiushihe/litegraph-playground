import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const HomePage: NextPage = () => {
  const { basePath } = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = `${basePath}/playground`;
    }
  }, [basePath]);

  return (
    <>
      <Head>
        <title>LiteGraph Playground</title>
        <meta name="description" content="A LiteGraph Playground" />
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </Head>
      <div>
        <Link href="/playground">
          <a>LiteGraph Playground</a>
        </Link>
      </div>
    </>
  );
};

export default HomePage;
