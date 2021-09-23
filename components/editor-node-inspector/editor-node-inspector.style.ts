import styled from "styled-components";

import { DISABLED, FOREGROUND_2, BACKGROUND_2 } from "../editor-ui/color";

export const EmptyState = styled.div`
  padding: 3px;
`;

export const EmptyStateContent = styled.div`
  color: ${FOREGROUND_2};
  border: 1px dashed ${DISABLED};
  border-radius: 6px;
  padding: 12px;
  margin: 6px;
`;

export const ToolbarContainer = styled.div`
  height: 22px;
`;

export const EditorFields = styled.div`
  padding: 3px 6px;
  background-color: ${BACKGROUND_2};
`;

export const EditorField = styled.div`
  margin: 6px 0;
`;
