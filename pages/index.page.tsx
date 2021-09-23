import React, { useEffect } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import PageHead from "../components/page-head";

const HomePage: NextPage = () => {
  const { basePath } = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = `${basePath}/playground`;
    }
  }, [basePath]);

  return (
    <>
      <PageHead
        title="LiteGraph Playground"
        description="A LiteGraph Playground"
      />
      <div>
        <Link href="/playground">
          <a>LiteGraph Playground</a>
        </Link>
      </div>
    </>
  );
};

export default HomePage;
