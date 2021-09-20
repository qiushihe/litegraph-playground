import React from "react";
import PropTypes, { InferProps } from "prop-types";
import noop from "lodash/fp/noop";

import {
  ItemSeparator,
  ItemSpacer,
  Toolbar,
  ToolbarItem
} from "../editor-ui/toolbar.style";

import {
  Base,
  RunStateLabel,
  UploadInput,
  FilenameInput,
  Checkbox
} from "./editor-toolbar.style";

const PROP_TYPES = {
  className: PropTypes.string,
  isRunning: PropTypes.bool,
  filename: PropTypes.string,
  snapToGrid: PropTypes.bool,
  onStart: PropTypes.func,
  onStop: PropTypes.func,
  onUpload: PropTypes.func,
  onDownload: PropTypes.func,
  onFilenameChange: PropTypes.func,
  onToggleSnapToGrid: PropTypes.func
};

const DEFAULT_PROPS = {
  className: "",
  isRunning: false,
  filename: "",
  snapToGrid: false,
  onStart: () => {},
  onStop: () => {},
  onUpload: () => {},
  onDownload: () => {},
  onFilenameChange: () => {},
  onToggleSnapToGrid: () => {}
};

const EditorToolbar: React.FunctionComponent<InferProps<typeof PROP_TYPES>> = (
  props
) => {
  const className = props.className || DEFAULT_PROPS.className;
  const isRunning = props.isRunning || DEFAULT_PROPS.isRunning;
  const filename = props.filename || DEFAULT_PROPS.filename;
  const snapToGrid = props.snapToGrid || DEFAULT_PROPS.snapToGrid;
  const onStart = props.onStart || DEFAULT_PROPS.onStart;
  const onStop = props.onStop || DEFAULT_PROPS.onStop;
  const onUpload = props.onUpload || DEFAULT_PROPS.onUpload;
  const onDownload = props.onDownload || DEFAULT_PROPS.onDownload;
  const onFilenameChange =
    props.onFilenameChange || DEFAULT_PROPS.onFilenameChange;
  const onToggleSnapToGrid =
    props.onToggleSnapToGrid || DEFAULT_PROPS.onToggleSnapToGrid;

  return (
    <Base>
      <Toolbar className={className}>
        <ToolbarItem onClick={isRunning ? onStop : onStart}>
          <RunStateLabel $isRunning={isRunning}>
            ⏻ {isRunning ? "Running" : "Stopped"}
          </RunStateLabel>
        </ToolbarItem>
        <ItemSeparator />
        <ToolbarItem>
          Upload
          <UploadInput onChange={onUpload} />
        </ToolbarItem>
        <ItemSpacer />
        <ToolbarItem onClick={onDownload}>Download</ToolbarItem>
        <ItemSeparator />
        <ToolbarItem>
          Filename:
          <ItemSpacer />
          <FilenameInput value={filename} onChange={onFilenameChange} />
        </ToolbarItem>
        <ItemSeparator />
        <ToolbarItem onClick={onToggleSnapToGrid}>
          <Checkbox checked={snapToGrid} onChange={noop} />
          <ItemSpacer />
          Align to Grid
        </ToolbarItem>
      </Toolbar>
    </Base>
  );
};

export default EditorToolbar;
