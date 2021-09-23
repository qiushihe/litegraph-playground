import styled, { css } from "styled-components";

import {
  FOREGROUND_1,
  FOREGROUND_2,
  SEPARATOR,
  FOCUSED,
  BACKGROUND_2,
  BACKGROUND_1
} from "../editor-ui/color";

export const Base = styled.div`
  background-color: ${BACKGROUND_2};
`;

const fieldStyle = css`
  width: 100%;
  border: 1px solid ${SEPARATOR};
  background-color: ${BACKGROUND_1};
  color: ${FOREGROUND_2};
  font-family: monospace;
  font-size: 13px;
  outline: none;
  padding: 3px 6px;

  &:hover,
  &:focus {
    color: ${FOREGROUND_1};
    border: 1px solid ${FOCUSED};
  }
`;

export const MultiLineField = styled.textarea`
  ${fieldStyle};
  min-height: 100px;
  resize: vertical;
`;

export const SingleLineField = styled.input.attrs({ type: "text" })<{
  onChange: any;
}>`
  ${fieldStyle};
`;

export const PropertyViewer = styled.div`
  cursor: default;
`;

export const PropertyTitle = styled.div`
  font-size: 11px;
  color: ${FOREGROUND_2};
  margin-bottom: 3px;
`;

export const PropertyValue = styled.div`
  font-size: 11px;
  color: ${FOREGROUND_1};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const buttonStyle = css`
  border: 1px solid ${SEPARATOR};
  border-radius: 9999px;
  font-size: 12px;
  color: ${FOREGROUND_2};
  background-color: transparent;

  &:hover,
  &:focus {
    color: ${FOREGROUND_1};
    border: 1px solid ${FOCUSED};
  }
`;

export const EditorForm = styled.form``;

export const EditorMeta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const EditorFormType = styled.div`
  display: inline-flex;
  flex-direction: row;
  margin: 6px 0;
  padding: 3px 9px;
  color: ${FOREGROUND_1};
  border: 1px solid ${SEPARATOR};
  border-radius: 9999px;
  cursor: default;
`;

export const EditorFormMultiLine = styled.label`
  display: inline-flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  user-select: none;
`;

export const EditorFormField = styled.div``;

export const EditorFormButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 6px;

  & > * {
    margin-right: 6px;
  }

  & > :last-child {
    margin-right: 0;
  }
`;

export const SaveButton = styled.input.attrs({
  type: "submit",
  value: "Save"
})`
  ${buttonStyle};
`;

export const CancelButton = styled.input.attrs({
  type: "button",
  value: "Cancel"
})`
  ${buttonStyle};
`;
