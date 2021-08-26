import React from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import cond from "lodash/fp/cond";
import constant from "lodash/fp/constant";
import stubTrue from "lodash/fp/stubTrue";

import {
  Play as PlayIcon,
  Square as StopIcon,
  UploadCloud as UploadIcon,
  DownloadCloud as DownloadIcon,
  Grid as ToggleGridSnapIcon
} from "react-feather";

/* eslint-disable  import/no-webpack-loader-syntax */
import LiteGraphCss from "!!raw-loader!litegraph.js/css/litegraph.css";
/* eslint-enable  import/no-webpack-loader-syntax */

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
`;

export const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 6px 0 black;
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
    background-color: #bbbbbb;
    transform: translateX(-50%);
  }
`;

export const ControlSpacer = styled.div`
  position: relative;
  width: 8px;
  height: 100%;
`;

const buttonStyle = ({ svgFill, svgStroke }) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #696969;
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
  ${buttonStyle({ svgFill: "none", svgStroke: "black" })};

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

    &::file-selector-button {
      visibility: hidden;
    }
  }
`;

export const DownloadButton = styled.button.attrs({
  children: <DownloadIcon />
})`
  ${buttonStyle({ svgFill: "none", svgStroke: "black" })};
`;

export const ToggleGridSnapButton = styled.button.attrs({
  children: <ToggleGridSnapIcon />
})`
  ${flow([
    get("$isActive"),
    cond([
      [Boolean, constant("green")],
      [stubTrue, constant("black")]
    ]),
    (svgStroke) => buttonStyle({ svgFill: "none", svgStroke })
  ])};
`;

export const Status = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StatusText = styled.span`
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

export const FilenameInput = styled.input.attrs({
  type: "text"
})`
  font-family: monospace;
  font-size: 14px;
  border: 1px solid #969696;
  border-radius: 6px;
  height: 28px;
  width: 200px;
  padding: 0 8px;
`;
