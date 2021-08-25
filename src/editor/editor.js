import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import constant from "lodash/fp/constant";
import identity from "lodash/fp/identity";
import matches from "lodash/fp/matches";
import replace from "lodash/fp/replace";
import isNil from "lodash/fp/isNil";

import {
  LGraph,
  LGraphCanvas,
  LGraphNode,
  LiteGraph
} from "litegraph.js/build/litegraph.core";

import addNode from "../context-menu/add-node";
import addGroup from "../context-menu/add-group";

import { useCustomNodeTypes } from "./effect";

import {
  GlobalStyle,
  Base,
  ControlsContainer,
  CanvasContainer,
  Canvas,
  ControlSeparator,
  ControlSpacer,
  PlayButton,
  StopButton,
  UploadButton,
  DownloadButton,
  Status,
  StatusText,
  FilenameInput
} from "./editor.style";

const CUSTOM_MENU_PREFIX_REGEXP = new RegExp("^_custom::");

const EXECUTION_RATE = 1000 / 30;

const getUploadedTextContent = ({ target: { files = [] } = {} } = {}) => {
  const file = files[0];
  if (!file) {
    return Promise.resolve([null, new Error("No file")]);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = ({ target: { result: content } = {} } = {}) => {
      resolve([file.name, content, null]);
    };
    reader.onerror = () => {
      resolve([null, null, reader.error]);
    };
    reader.onabort = () => {
      resolve([null, null, new Error("Aborted")]);
    };
    reader.readAsText(file);
  });
};

const sendAsTextDownload = (filename, textContent) => {
  const elm = document.createElement("a");
  elm.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(textContent)
  );
  elm.setAttribute("download", filename);

  elm.style.display = "none";
  document.body.appendChild(elm);

  elm.click();

  setTimeout(() => {
    document.body.removeChild(elm);
  }, 1);
};

const Editor = ({ className, autoStart }) => {
  const graphRef = useRef(new LGraph());
  const canvasRef = useRef(null);
  const [graphIsRunning, setGraphIsRunning] = useState(false);
  const [filename, setFilename] = useState("untitled.json");

  const handleStartStop = useCallback(() => {
    const { current: graph } = graphRef;

    if (graphIsRunning) {
      graph.stop();
    } else {
      graph.start();
    }
  }, [graphIsRunning, graphRef]);

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
          try {
            data = JSON.parse(uploaded);
          } catch (err) {
            data = null;
            // TODO: Display nicer error message.
            console.error("JSON parse error", err);
          }

          if (!isNil(data)) {
            graph.configure(data, false);
            setFilename(filename);
          }
        }
      }
    },
    [graphRef]
  );

  const handleDownload = useCallback(() => {
    const { current: graph } = graphRef;

    if (graph) {
      sendAsTextDownload(filename, JSON.stringify(graph.serialize(), null, 2));
    }
  }, [graphRef, filename]);

  const handleFilenameChange = useCallback(
    ({ target: { value: newFilename } = {} } = {}) => {
      setFilename(newFilename);
    },
    []
  );

  useCustomNodeTypes({ prefix: "_custom::", LiteGraph, LGraphNode });

  useEffect(() => {
    const { current: graph } = graphRef;

    if (graph) {
      graph.onPlayEvent = () => {
        setGraphIsRunning(true);
      };

      graph.onStopEvent = () => {
        setGraphIsRunning(false);
      };

      if (autoStart) {
        graph.start(EXECUTION_RATE);
      }
    }
  }, [autoStart]);

  useEffect(() => {
    const { current: graph } = graphRef;

    if (graph) {
      const graphCanvas = new LGraphCanvas(canvasRef.current, graph, {
        autoresize: true
      });

      graphCanvas.allow_searchbox = false;

      graphCanvas.getMenuOptions = () => [
        {
          content: "Add Node",
          has_submenu: true,
          callback: addNode({
            LGraphCanvas,
            LiteGraph,
            filterNodeTypes: constant(true),
            mapMenuLabel: (entry, path) =>
              matches(CUSTOM_MENU_PREFIX_REGEXP)(path)
                ? replace(CUSTOM_MENU_PREFIX_REGEXP, "")(entry)
                : entry,
            mapEntryLabel: identity
          })
        },
        {
          content: "Add Group",
          has_submenu: false,
          callback: addGroup({
            LGraphCanvas,
            LiteGraph
          })
        }
      ];
    }
  }, []);

  return (
    <Base className={className}>
      <GlobalStyle />
      <ControlsContainer>
        {graphIsRunning ? (
          <StopButton onClick={handleStartStop} />
        ) : (
          <PlayButton onClick={handleStartStop} />
        )}
        <ControlSeparator />
        <Status>
          Status:
          <StatusText $isRunning={graphIsRunning}>
            {graphIsRunning ? "Running" : "Stopped"}
          </StatusText>
        </Status>
        <ControlSeparator />
        <UploadButton onChange={handleUpload} />
        <ControlSpacer />
        <DownloadButton onClick={handleDownload} />
        <ControlSpacer />
        <div>
          Filename:{" "}
          <FilenameInput value={filename} onChange={handleFilenameChange} />
        </div>
      </ControlsContainer>
      <CanvasContainer>
        <Canvas
          ref={canvasRef}
          // Because the `autoresize` option is set to `true` on the `LGraphCanvas` instance, these
          // numbers are only the "initial" dimension of the canvas. And after the page loads, and
          // subsequently resizes, the `litegraph.js` library itself will automatically maintain and
          // update these 2 attributes.
          width={1920}
          height={1080}
        />
      </CanvasContainer>
    </Base>
  );
};

Editor.propTypes = {
  className: PropTypes.string,
  autoStart: PropTypes.bool
};

Editor.defaultProps = {
  className: "",
  autoStart: false
};

export default Editor;
