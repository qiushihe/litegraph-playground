import React, { useEffect, useRef } from "react";
import constant from "lodash/fp/constant";
import identity from "lodash/fp/identity";
import matches from "lodash/fp/matches";
import replace from "lodash/fp/replace";

import {
  LGraph,
  LGraphCanvas,
  LGraphNode,
  LiteGraph
} from "litegraph.js/build/litegraph.core";

import "litegraph.js/css/litegraph.css";

import addNode from "./context-menu/add-node";
import addGroup from "./context-menu/add-group";

import { registerNodes } from "./node-type";

const CUSTOM_MENU_PREFIX_REGEXP = new RegExp("^_custom::");

const App = () => {
  const baseRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    canvasRef.current.setAttribute("width", baseRef.current.clientWidth);
    canvasRef.current.setAttribute("height", baseRef.current.clientHeight);

    registerNodes(LiteGraph.registerNodeType.bind(LiteGraph), {
      LGraphNode,
      LiteGraph
    });

    const graph = new LGraph();
    const graphCanvas = new LGraphCanvas(canvasRef.current, graph);

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

    graph.onStopEvent = () => {
      console.log(graph.serialize());
    };

    graph.start();
  }, []);

  return (
    <div ref={baseRef} style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default App;
