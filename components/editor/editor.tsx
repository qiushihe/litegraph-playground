import React, { useEffect, useRef, useState } from "react";
import PropTypes, { InferProps } from "prop-types";
import mergeRefs from "react-merge-refs";
import noop from "lodash/fp/noop";

import { LGraph, LGraphCanvas } from "../../litegraph-core";
import { PREFIX } from "../../enum/node-type.enum";
import EditorToolbar from "../editor-toolbar";
import EditorNodeTypesList from "../editor-node-types-list";
import EditorNodeInspector from "../editor-node-inspector";
import { withEditorState, IEditorState } from "../editor-state-provider";

import {
  HorizontalSeparator,
  VerticalSeparator
} from "../editor-ui/separator.style";

import {
  useEditorStateDelegate,
  useCustomNodeTypes,
  useCustomNodeTypesDropZone,
  useRunningState,
  useFilename,
  useUploadDownload,
  useGridSnap,
  useNodeOperations
} from "./effect";

import {
  GlobalStyle,
  Base,
  WorkspaceContainer,
  CanvasContainer,
  SidebarContainer,
  SidebarScrollableContent,
  Canvas
} from "./editor.style";

const EXECUTION_RATE = 1000 / 60;

const PROP_TYPES = {
  className: PropTypes.string,
  editorState: PropTypes.object,
  autoStart: PropTypes.bool
};

const DEFAULT_PROPS = {
  className: "",
  editorState: {},
  autoStart: false
};

type EditorProps = InferProps<typeof PROP_TYPES>;

const Editor: React.FunctionComponent<EditorProps> = (props) => {
  const className = props.className || DEFAULT_PROPS.className;
  const editorState = (props.editorState ||
    DEFAULT_PROPS.editorState) as IEditorState;
  const autoStart = props.autoStart || DEFAULT_PROPS.autoStart;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graph] = useState<LGraph>(new LGraph());
  const [graphCanvas, setGraphCanvas] = useState<LGraphCanvas | null>(null);

  useEditorStateDelegate(graph, graphCanvas, editorState);

  const { nodeTypesManifest } = useCustomNodeTypes(PREFIX);
  const { dropZoneRef } = useCustomNodeTypesDropZone(graph, graphCanvas);

  const { isRunning, handleStartStop } = useRunningState(
    graph,
    autoStart,
    EXECUTION_RATE
  );

  const { filename, setFilename, handleFilenameChange } =
    useFilename("untitled.json");

  const { handleUpload, handleDownload } = useUploadDownload(
    graph,
    filename,
    setFilename
  );

  const { snapToGrid, handleToggleGridSnap } = useGridSnap(graphCanvas);

  const { handleRemoveNode, handleCloneNode, handleFocusNode } =
    useNodeOperations(editorState, graphCanvas);

  useEffect(() => {
    const { current: canvas } = canvasRef;

    if (graph && canvas) {
      const graphCanvas = new LGraphCanvas(canvas, graph, {
        autoresize: true
      });

      graphCanvas.allow_searchbox = false;
      graphCanvas.onShowNodePanel = noop;

      // Suppress all node context menu because the functionalities in the menu that we care about
      // can all be done through the rest of the app's UI.
      graphCanvas.processContextMenu = () => {};

      setGraphCanvas(graphCanvas);
    }
  }, [graph, setGraphCanvas]);

  return (
    <Base className={className || ""}>
      <GlobalStyle />
      <EditorToolbar
        isRunning={isRunning}
        filename={filename}
        snapToGrid={snapToGrid}
        onStart={handleStartStop}
        onStop={handleStartStop}
        onUpload={handleUpload}
        onDownload={handleDownload}
        onFilenameChange={handleFilenameChange}
        onToggleSnapToGrid={handleToggleGridSnap}
      />
      <HorizontalSeparator />
      <WorkspaceContainer>
        <SidebarContainer $side="left">
          <SidebarScrollableContent>
            <EditorNodeTypesList manifest={nodeTypesManifest} />
          </SidebarScrollableContent>
        </SidebarContainer>
        <VerticalSeparator />
        <CanvasContainer>
          <Canvas
            ref={mergeRefs([canvasRef, dropZoneRef])}
            // Because the `autoresize` option is set to `true` on the `LGraphCanvas` instance, these
            // numbers are only the "initial" dimension of the canvas. And after the page loads, and
            // subsequently resizes, the `litegraph.js` library itself will automatically maintain and
            // update these 2 attributes.
            width={1920}
            height={1080}
          />
        </CanvasContainer>
        <VerticalSeparator />
        <SidebarContainer $side="right">
          <SidebarScrollableContent>
            <EditorNodeInspector
              onRemoveNode={handleRemoveNode}
              onCloneNode={handleCloneNode}
              onFocusNode={handleFocusNode}
            />
          </SidebarScrollableContent>
        </SidebarContainer>
      </WorkspaceContainer>
    </Base>
  );
};

Editor.propTypes = PROP_TYPES;
Editor.defaultProps = DEFAULT_PROPS;

export default withEditorState<EditorProps>(Editor);
