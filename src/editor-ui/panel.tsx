import React from "react";
import PropTypes, { InferProps } from "prop-types";

import { HorizontalSeparator } from "./separator.style";
import { Base, Title } from "./panel.style";

const PROP_TYPES = {
  className: PropTypes.string,
  children: PropTypes.any,
  title: PropTypes.string
};

const DEFAULT_PROPS = {
  className: "",
  children: null,
  title: "Panel"
};

const Panel: React.FunctionComponent<InferProps<typeof PROP_TYPES>> = (
  props
) => {
  const className = props.className || DEFAULT_PROPS.className;
  const children = props.children || DEFAULT_PROPS.children;
  const title = props.title || DEFAULT_PROPS.title;

  return (
    <Base className={className}>
      <Title>{title}</Title>
      <HorizontalSeparator />
      {children}
    </Base>
  );
};

Panel.propTypes = PROP_TYPES;
Panel.defaultProps = DEFAULT_PROPS;

export default Panel;
