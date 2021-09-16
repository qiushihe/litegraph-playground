import styled, { css } from "styled-components";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import cond from "lodash/fp/cond";
import constant from "lodash/fp/constant";
import stubTrue from "lodash/fp/stubTrue";

import {
  BACKGROUND_2,
  DISABLED,
  FOREGROUND_1,
  FOREGROUND_2,
  SEPARATOR
} from "./color";

export const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  padding: 0 6px;
  background-color: ${BACKGROUND_2};
`;

const toolbarItemDisabled = css`
  color: ${DISABLED};
`;

export const ToolbarItem = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  padding: 3px 6px;
  font-size: 12px;
  color: ${FOREGROUND_2};
  cursor: default;
  user-select: none;

  &:hover {
    color: ${FOREGROUND_1};
  }

  ${flow([
    get("disabled"),
    cond([
      [Boolean, constant(toolbarItemDisabled)],
      [stubTrue, constant(null)]
    ])
  ])};
`;

export const ItemSeparator = styled.div`
  position: relative;
  width: 12px;
  height: ${(16 / 24) * 100}%;

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    box-shadow: inset -1px 0 0 0 ${SEPARATOR};
  }
`;

export const ItemSpacer = styled.div`
  display: inline-flex;
  position: relative;
  width: 6px;
  height: 100%;
`;
