import React, { useCallback, useEffect, useState, useRef } from "react";
import isNil from "lodash/fp/isNil";
import isEmpty from "lodash/fp/isEmpty";
import forEach from "lodash/fp/forEach";

import { LiteGraph, LGraph, LGraphCanvas } from "../litegraph-core";
import BaseNode, { BaseNodeClass } from "../node-type/base-node";
import { registerNodes } from "../node-type";
import { getUploadedTextContent } from "../util/upload";
import { sendAsTextDownload } from "../util/download";

export const useCustomNodeTypes = (prefix: string) => {
  const [manifest, setManifest] = useState<{ key: string; title: string }[]>(
    []
  );

  // Use a registration status ref to avoid infinite loop caused by additional rendering cycles
  // triggered by the `setManifest` call.
  const statusRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
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
  graphRef: React.MutableRefObject<LGraph>,
  autoStart: boolean,
  executionRate: number
) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleStartStop = useCallback(() => {
    const { current: graph } = graphRef;

    if (isRunning) {
      graph.stop();
    } else {
      graph.start();
    }
  }, [isRunning, graphRef]);

  useEffect(() => {
    const { current: graph } = graphRef;

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
  }, [autoStart, executionRate, graphRef]);

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
  graphRef: React.MutableRefObject<LGraph>,
  filename: string,
  setFilename: (filename: string) => void
) => {
  const handleUpload = useCallback(
    async (evt) => {
      const { current: graph } = graphRef;

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
    [graphRef, setFilename]
  );

  const handleDownload = useCallback(() => {
    const { current: graph } = graphRef;

    if (graph) {
      sendAsTextDownload(filename, JSON.stringify(graph.serialize(), null, 2));
    }
  }, [graphRef, filename]);

  return { handleUpload, handleDownload };
};

export const useGridSnap = (
  graphCanvasRef: React.MutableRefObject<LGraphCanvas | null>
) => {
  const [snapToGrid, setSnapToGrid] = useState(false);

  const handleToggleGridSnap = useCallback(() => {
    const { current: graphCanvas } = graphCanvasRef;

    if (graphCanvas) {
      (graphCanvas as LGraphCanvas).align_to_grid = !snapToGrid;
    }

    setSnapToGrid(!snapToGrid);
  }, [graphCanvasRef, snapToGrid]);

  return { snapToGrid, setSnapToGrid, handleToggleGridSnap };
};

export const useNodeOperations = () => {
  const [selectedNodes, setSelectedNodes] = useState<BaseNode[]>([]);

  const handleRemoveNode = useCallback(() => {
    forEach((node: BaseNode) => {
      const graph = node.graph;
      graph.beforeChange();
      graph.remove(node);
      graph.afterChange();
      node.setDirtyCanvas(true, true);
    })(selectedNodes);
  }, [selectedNodes]);

  const handleCloneNode = useCallback(() => {
    forEach((node: BaseNode) => {
      const newNode = node.clone();
      if (newNode) {
        newNode.pos = [node.pos[0] + 5, node.pos[1] + 5];
        node.graph.beforeChange();
        node.graph.add(newNode);
        node.graph.afterChange();
        node.setDirtyCanvas(true, true);
      }
    })(selectedNodes);
  }, [selectedNodes]);

  return { selectedNodes, setSelectedNodes, handleRemoveNode, handleCloneNode };
};
