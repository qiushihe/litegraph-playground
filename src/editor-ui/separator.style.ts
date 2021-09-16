import styled from "styled-components";

import { SEPARATOR } from "./color";

export const HorizontalSeparator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${SEPARATOR};
`;

export const VerticalSeparator = styled.div`
  width: 1px;
  height: 100%;
  background-color: ${SEPARATOR};
`;
