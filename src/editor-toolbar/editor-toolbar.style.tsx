import styled from "styled-components";

import {
  BACKGROUND_1,
  FOREGROUND_1,
  FOREGROUND_2,
  FOCUSED
} from "../editor-ui/color";

export const Base = styled.div`
  height: 30px;
`;

export const UploadInput = styled.input.attrs({
  type: "file"
})<{ disabled?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  // noinspection CssInvalidPseudoSelector
  &::file-selector-button {
    visibility: hidden;
  }
`;

export const FilenameInput = styled.input.attrs({
  type: "text"
})`
  outline: none;
  border: none;
  border-radius: 0;
  color: ${FOREGROUND_2};
  background-color: ${BACKGROUND_1};
  width: 200px;
  padding: 3px 6px;

  &:hover {
    color: ${FOREGROUND_1};
    box-shadow: inset 0 0 0 1px ${FOREGROUND_2};
  }

  &:focus {
    color: ${FOREGROUND_1};
    box-shadow: inset 0 0 0 1px ${FOCUSED};
  }
`;

export const Checkbox = styled.input.attrs({
  type: "checkbox"
})`
  margin: 0;
  padding: 0;
`;
