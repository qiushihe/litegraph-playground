import React from "react";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import cond from "lodash/fp/cond";
import constant from "lodash/fp/constant";
import stubTrue from "lodash/fp/stubTrue";

import styled, {
  createGlobalStyle,
  css,
  StyledComponent
} from "styled-components";

import {
  Play as PlayIcon,
  Square as StopIcon,
  UploadCloud as UploadIcon,
  DownloadCloud as DownloadIcon,
  Grid as ToggleGridSnapIcon
} from "react-feather";

/* eslint-disable  import/no-webpack-loader-syntax */
// @ts-ignore
import LiteGraphCss from "!!raw-loader!litegraph.js/css/litegraph.css";
/* eslint-enable  import/no-webpack-loader-syntax */

const TEXT_COLOUR = "#999999";
const STROKE_COLOUR = "#999999";

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

export const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 14px;
  background-color: #333333;
  box-shadow: inset 0px -1px 0 0 black;
`;

export const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1a1a1a;

  // Match Chrome's bottom corner radius.
  border-radius: 0 0 10px 10px;
`;

export const Canvas = styled.canvas`
  width: 100%;
  height: 100%;

  // The point of this inner glow is so that I would know if the canvas element is ever rendered
  // with incorrect dimension/position. Because if the canvas element is rendered correctly, then
  // all 4 edges of the inner glow should be visible. If the canvas is ever not rendered correctly,
  // then some of the glow would not be visible, and that'd be easy to tell/fix.
  box-shadow: inset 0 0 6px 0 #cccccc;
`;

export const ControlSeparator = styled.div`
  position: relative;
  width: 24px;
  height: 100%;

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 50%;
    bottom: 0;
    width: 1px;
    background-color: ${STROKE_COLOUR};
    transform: translateX(-50%);
  }
`;

export const ControlSpacer = styled.div`
  position: relative;
  width: 8px;
  height: 100%;
`;

const buttonStyle = ({
  svgFill,
  svgStroke
}: {
  svgFill: string;
  svgStroke: string;
}) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${STROKE_COLOUR};
  border-radius: 8px;
  background-color: transparent;
  cursor: pointer;

  svg {
    fill: ${svgFill};
    stroke: ${svgStroke};
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: initial;

    &:active {
      transform: none;
    }
  }
`;

export const PlayButton = styled.button.attrs({
  children: <PlayIcon />
})`
  ${buttonStyle({ svgFill: "green", svgStroke: "green" })};
`;

export const StopButton = styled.button.attrs({
  children: <StopIcon />
})`
  ${buttonStyle({ svgFill: "red", svgStroke: "red" })};
`;

export const UploadButton = styled(({ className, onChange }) => {
  return (
    <div className={className}>
      <input type="file" onChange={onChange} />
      <UploadIcon />
    </div>
  );
})`
  ${buttonStyle({ svgFill: "none", svgStroke: STROKE_COLOUR })};

  position: relative;

  & > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 18px;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  & > input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    // noinspection CssInvalidPseudoSelector
    &::file-selector-button {
      visibility: hidden;
    }
  }
`;

export const DownloadButton = styled.button.attrs({
  children: <DownloadIcon />
})`
  ${buttonStyle({ svgFill: "none", svgStroke: STROKE_COLOUR })};
`;

export const ToggleGridSnapButton: StyledComponent<
  "button",
  any,
  { $isActive: boolean; children: JSX.Element },
  "children"
> = styled.button.attrs({
  children: <ToggleGridSnapIcon />
})`
  ${flow([
    get("$isActive"),
    cond([
      [Boolean, constant("green")],
      [stubTrue, constant(STROKE_COLOUR)]
    ]),
    (svgStroke) => buttonStyle({ svgFill: "none", svgStroke })
  ])};
`;

export const Status = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${TEXT_COLOUR};
`;

export const StatusText: StyledComponent<
  "span",
  any,
  { $isRunning: boolean }
> = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 24px;
  margin-left: 6px;
  font-size: 12px;
  font-family: sans-serif;
  border-radius: 6px;
  box-shadow: 0 1px 0 0 black;
  text-shadow: 0 1px 0 black;
  text-transform: uppercase;

  color: white;
  background-color: ${flow([
    get("$isRunning"),
    cond([
      [Boolean, constant("green")],
      [stubTrue, constant("red")]
    ])
  ])};
`;

export const Filename = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${TEXT_COLOUR};
`;

export const FilenameInput = styled.input.attrs({
  type: "text"
})`
  font-family: monospace;
  font-size: 14px;
  border: 1px solid ${STROKE_COLOUR};
  border-radius: 6px;
  height: 28px;
  width: 200px;
  margin-left: 6px;
  padding: 0 8px;
  background-color: transparent;
  color: white;
`;
