import styled, { createGlobalStyle } from "styled-components";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import cond from "lodash/fp/cond";
import eq from "lodash/fp/eq";
import constant from "lodash/fp/constant";
import stubTrue from "lodash/fp/stubTrue";

/* eslint-disable  import/no-webpack-loader-syntax */
// @ts-ignore
import LiteGraphCss from "!!raw-loader!litegraph.js/css/litegraph.css";
/* eslint-enable  import/no-webpack-loader-syntax */

import { FOREGROUND_2, BACKGROUND_2 } from "../editor-ui/color";

export const GlobalStyle = createGlobalStyle`
  ${LiteGraphCss};
`;

export const Base = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const WorkspaceContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

export const CanvasContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;
`;

export const SidebarContainer = styled.div<{ $side: "left" | "right" }>`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0;
  background-color: ${BACKGROUND_2};
  color: ${FOREGROUND_2};

  min-width: ${flow([
    get("$side"),
    cond([
      [eq("left"), constant("250px")],
      [eq("right"), constant("300px")],
      [stubTrue, constant("200px")]
    ])
  ])};
`;

export const SidebarScrollableContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
`;

export const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  // The point of this inner glow is so that I would know if the canvas element is ever rendered
  // with incorrect dimension/position. Because if the canvas element is rendered correctly, then
  // all 4 edges of the inner glow should be visible. If the canvas is ever not rendered correctly,
  // then some of the glow would not be visible, and that'd be easy to tell/fix.
  // box-shadow: inset 0 0 6px 0 #cccccc;
`;
