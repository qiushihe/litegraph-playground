import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDrop } from "react-dnd";
import isNil from "lodash/fp/isNil";
import isEmpty from "lodash/fp/isEmpty";
import flow from "lodash/fp/flow";
import values from "lodash/fp/values";
import map from "lodash/fp/map";
import get from "lodash/fp/get";

import { addNodeToCanvas } from "../../util/litegraph";
import { LiteGraph, LGraph, LGraphCanvas } from "../../litegraph-core";
import BaseNode, { BaseNodeClass } from "../node-type/base-node";
import { registerNodes } from "../node-type";
import { getUploadedTextContent } from "../../util/upload";
import { sendAsTextDownload } from "../../util/download";
import { IEditorState, IEditorStateDelegate } from "../editor-state-provider";
import { Coordinate } from "../../util/canvas";
import { POS_X, POS_Y } from "../../enum/canvas.enum";

export const useCustomNodeTypes = (prefix: string) => {
  const [manifest, setManifest] = useState<{ key: string; title: string }[]>(
    []
  );

  // Use a registration status ref to avoid infinite loop caused by additional rendering cycles
  // triggered by the `setManifest` call.
  const statusRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    // Clear all built-in node types.
    if (manifest.length <= 0) {
      LiteGraph.clearRegisteredTypes();
    }

    // Use an intermediate array to prevent unnecessary calls to `setManifest`.
    const registeredManifest: { key: string; title: string }[] = [];

    registerNodes(prefix, (key: string, NodeType: BaseNodeClass) => {
      if (!statusRef.current[key]) {
        LiteGraph.registerNodeType(key, NodeType);
        statusRef.current[key] = true;
        registeredManifest.push({ key, title: NodeType.title });
      }
    });

    if (!isEmpty(registeredManifest)) {
      setManifest([...manifest, ...registeredManifest]);
    }
  }, [prefix, manifest]);

  return { nodeTypesManifest: manifest };
};

export const useRunningState = (
  graph: LGraph,
  autoStart: boolean,
  executionRate: number
) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleStartStop = useCallback(() => {
    if (isRunning) {
      graph.stop();
    } else {
      graph.start();
    }
  }, [isRunning, graph]);

  useEffect(() => {
    if (graph) {
      graph.onPlayEvent = () => {
        setIsRunning(true);
      };

      graph.onStopEvent = () => {
        setIsRunning(false);
      };

      if (autoStart) {
        graph.start(executionRate);
      }
    }
  }, [autoStart, executionRate, graph]);

  return {
    isRunning,
    handleStartStop
  };
};

export const useFilename = (defaultFilename: string) => {
  const [filename, setFilename] = useState(defaultFilename);

  const handleFilenameChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const { target: { value: newFilename } = {} } = evt;

      if (!newFilename) {
        setFilename("Untitled.json");
      } else {
        setFilename(newFilename);
      }
    },
    []
  );

  return { filename, setFilename, handleFilenameChange };
};

export const useUploadDownload = (
  graph: LGraph,
  filename: string,
  setFilename: (filename: string) => void
) => {
  const handleUpload = useCallback(
    async (evt) => {
      if (graph) {
        const [filename, uploaded, uploadErr] = await getUploadedTextContent(
          evt
        );
        if (uploadErr) {
          // TODO: Display nicer error message.
          console.error(uploadErr);
        } else {
          let data;
          if (!uploaded) {
            data = null;
            // TODO: Display nicer error message.
            console.error("No uploaded data");
          } else {
            try {
              data = JSON.parse(uploaded);
            } catch (err) {
              data = null;
              // TODO: Display nicer error message.
              console.error("JSON parse error", err);
            }
          }

          if (!isNil(data)) {
            graph.configure(data, false);

            if (!filename) {
              setFilename("Untitled.json");
            } else {
              setFilename(filename);
            }
          }
        }
      }
    },
    [graph, setFilename]
  );

  const handleDownload = useCallback(() => {
    if (graph) {
      sendAsTextDownload(filename, JSON.stringify(graph.serialize(), null, 2));
    }
  }, [graph, filename]);

  return { handleUpload, handleDownload };
};

export const useGridSnap = (graphCanvas: LGraphCanvas | null) => {
  const [snapToGrid, setSnapToGrid] = useState(false);

  const handleToggleGridSnap = useCallback(() => {
    if (graphCanvas) {
      (graphCanvas as LGraphCanvas).align_to_grid = !snapToGrid;
    }

    setSnapToGrid(!snapToGrid);
  }, [graphCanvas, snapToGrid]);

  return { snapToGrid, setSnapToGrid, handleToggleGridSnap };
};

export const useNodeOperations = (
  editorState: IEditorState,
  graphCanvas: LGraphCanvas | null
) => {
  useEffect(() => {
    if (graphCanvas) {
      graphCanvas.onSelectionChange = (selectedNodes) => {
        const selectedNodeIds = flow([values, map(get("id"))])(selectedNodes);
        editorState.setSelectedNodeIds(selectedNodeIds);
      };
    }
  }, [graphCanvas, editorState]);

  const handleRemoveNode = useCallback(() => {
    editorState.removeNodesByIds(editorState.getSelectedNodeIds());
  }, [editorState]);

  const handleCloneNode = useCallback(() => {
    editorState.cloneNodesByIds(editorState.getSelectedNodeIds());
  }, [editorState]);

  const handleFocusNode = useCallback(() => {
    editorState.focusNodesByIds(editorState.getSelectedNodeIds());
  }, [editorState]);

  return { handleRemoveNode, handleCloneNode, handleFocusNode };
};

export const useEditorStateDelegate = (
  graph: LGraph,
  graphCanvas: LGraphCanvas | null,
  editorState: IEditorState
) => {
  const [editorStateDelegate, setEditorStateDelegate] =
    useState<IEditorStateDelegate | null>(null);

  useEffect(() => {
    setEditorStateDelegate({
      getNodeById: (id: number) => graph.getNodeById(id) as BaseNode | null,
      setCanvasCenter: (coordinate: Coordinate) => {
        if (graphCanvas) {
          const { width: canvasWidth, height: canvasHeight } =
            graphCanvas.canvas.getBoundingClientRect();

          const canvasCenter = [
            canvasWidth / 2,
            canvasHeight / 2
          ] as Coordinate;

          graphCanvas.ds.offset = [
            canvasCenter[POS_X] - coordinate[POS_X],
            canvasCenter[POS_Y] - coordinate[POS_Y]
          ];

          graphCanvas.ds.computeVisibleArea();
          graphCanvas.draw(true, true);
        }
      }
    });
  }, [graph, graphCanvas]);

  useEffect(() => {
    if (editorStateDelegate !== null) {
      editorState.setDelegate(editorStateDelegate);
    }
  }, [editorState, editorStateDelegate]);
};

export const useCustomNodeTypesDropZone = (
  graph: LGraph,
  graphCanvas: LGraphCanvas | null
) => {
  const [, dropZoneRef] = useDrop(
    () => ({
      accept: "CUSTOM_NODE_TYPE",
      drop: (item: { nodeTypeKey: string }, monitor) => {
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
    [graph, graphCanvas]
  );

  return { dropZoneRef };
};
