import styled from "styled-components";

import { FOREGROUND_1, BACKGROUND_1, BACKGROUND_2 } from "./color";

export const Base = styled.div`
  font-family: menlo, monospace;
  font-size: 11px;
  color: ${FOREGROUND_1};
  background-color: ${BACKGROUND_1};
`;

export const Title = styled.div`
  padding: 6px;
  background-color: ${BACKGROUND_2};
`;
