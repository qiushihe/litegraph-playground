import styled from "styled-components";

import { BACKGROUND_2, FOREGROUND_2, FOREGROUND_1 } from "../editor-ui/color";

export const Category = styled.div``;

export const CategoryLabel = styled.div`
  padding: 3px 6px;
  text-transform: uppercase;
  background-color: ${BACKGROUND_2};
  color: ${FOREGROUND_2};
  cursor: default;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const CategoryNodeTypes = styled.div``;

export const NodeTypeLabel = styled.div`
  padding: 3px 6px 3px 2em;
  color: ${FOREGROUND_1};
  cursor: default;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
