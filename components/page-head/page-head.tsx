import React from "react";
import PropTypes, { InferProps } from "prop-types";
import Head from "next/head";
import { useRouter } from "next/router";

const PROP_TYPES = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.any
};

const DEFAULT_PROPS = {
  title: "",
  description: "",
  children: null
};

type PageHeadProps = InferProps<typeof PROP_TYPES>;

const PageHead: React.FunctionComponent<PageHeadProps> = (props) => {
  const title = props.title || DEFAULT_PROPS.title;
  const description = props.description || DEFAULT_PROPS.description;
  const children = props.children || DEFAULT_PROPS.children;

  const { basePath } = useRouter();

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href={`${basePath}/favicon.ico`} />
      {children}
    </Head>
  );
};

PageHead.propTypes = PROP_TYPES;
PageHead.defaultProps = DEFAULT_PROPS;

export default PageHead;
