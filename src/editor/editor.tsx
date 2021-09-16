import React, { useEffect, useRef } from "react";
import PropTypes, { InferProps } from "prop-types";
import flow from "lodash/fp/flow";
import values from "lodash/fp/values";
import noop from "lodash/fp/noop";

import mergeRefs from "react-merge-refs";
import { useDrop } from "react-dnd";

import { LGraph, LGraphCanvas } from "../litegraph-core";
import { PREFIX } from "../enum/node-type.enum";
import { addNodeToCanvas } from "../util/litegraph";
import EditorToolbar from "../editor-toolbar";
import EditorNodeTypesList from "../editor-node-types-list";
import EditorNodeInspector from "../editor-node-inspector";

import {
  HorizontalSeparator,
  VerticalSeparator
} from "../editor-ui/separator.style";

import {
  useCustomNodeTypes,
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
  autoStart: PropTypes.bool
};

const DEFAULT_PROPS = {
  className: "",
  autoStart: false
};

const Editor: React.FunctionComponent<InferProps<typeof PROP_TYPES>> = ({
  className,
  autoStart
}) => {
  const graphRef = useRef<LGraph>(new LGraph());
  const graphCanvasRef = useRef<LGraphCanvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { nodeTypesManifest } = useCustomNodeTypes(PREFIX);

  const { isRunning, handleStartStop } = useRunningState(
    graphRef,
    !!autoStart,
    EXECUTION_RATE
  );

  const { filename, setFilename, handleFilenameChange } =
    useFilename("untitled.json");

  const { handleUpload, handleDownload } = useUploadDownload(
    graphRef,
    filename,
    setFilename
  );

  const { snapToGrid, handleToggleGridSnap } = useGridSnap(graphCanvasRef);

  const { selectedNodes, setSelectedNodes, handleRemoveNode, handleCloneNode } =
    useNodeOperations();

  useEffect(() => {
    const { current: graph } = graphRef;
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

      graphCanvas.onSelectionChange = (selectedNodes) => {
        flow([values, setSelectedNodes])(selectedNodes);
      };

      graphCanvasRef.current = graphCanvas;
    }
  }, [setSelectedNodes]);

  const [, dropRef] = useDrop(
    () => ({
      accept: "CUSTOM_NODE_TYPE",
      drop: (item: { nodeTypeKey: string }, monitor) => {
        const { current: graph } = graphRef;
        const { current: graphCanvas } = graphCanvasRef;
        const dropOffset = monitor.getClientOffset();
        const dragOffset = monitor.getInitialClientOffset();
        const dragSourceOffset = monitor.getInitialSourceClientOffset();

        if (
          graph &&
          graphCanvas &&
          dropOffset &&
          dragOffset &&
          dragSourceOffset
        ) {
          addNodeToCanvas(graphCanvas)(item.nodeTypeKey, [
            dropOffset.x - (dragOffset.x - dragSourceOffset.x),
            dropOffset.y - (dragOffset.y - dragSourceOffset.y)
          ]);
        }
      },
      collect: () => ({})
    }),
    [graphRef, graphCanvasRef]
  );

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
            ref={mergeRefs([canvasRef, dropRef])}
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
              nodes={selectedNodes}
              onRemoveNode={handleRemoveNode}
              onCloneNode={handleCloneNode}
            />
          </SidebarScrollableContent>
        </SidebarContainer>
      </WorkspaceContainer>
    </Base>
  );
};

Editor.propTypes = PROP_TYPES;
Editor.defaultProps = DEFAULT_PROPS;

export default Editor;
