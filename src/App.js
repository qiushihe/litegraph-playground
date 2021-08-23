import React, { useEffect, useRef } from "react";

import {
  LGraph,
  LGraphCanvas,
  LiteGraph
} from "litegraph.js/build/litegraph.min";

import "litegraph.js/css/litegraph.css";

import addNode from "./context-menu/add-node";
import addGroup from "./context-menu/add-group";

import Sum from "./node-type/sum";
import Reduce from "./node-type/reduce";
import Portal from "./node-type/portal";
import SumFn from "./node-type/fn/sum-fn";
import ReduceFn from "./node-type/fn/reduce-fn";
import InvokeFunction from "./node-type/invoke-function";
import Button from "./node-type/button";
import ConsoleLog from "./node-type/console-log";

LiteGraph.registerNodeType("_custom/consoleLog", ConsoleLog);
LiteGraph.registerNodeType("_custom/button", Button);
LiteGraph.registerNodeType("_custom/sum", Sum);
LiteGraph.registerNodeType("_custom/reduce", Reduce);
LiteGraph.registerNodeType("_custom/portal", Portal);
LiteGraph.registerNodeType("_custom/invokeFunction", InvokeFunction);
LiteGraph.registerNodeType("_custom/fn/sumFn", SumFn);
LiteGraph.registerNodeType("_custom/fn/reduceFn", ReduceFn);

const App = () => {
  const baseRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    canvasRef.current.setAttribute("width", baseRef.current.clientWidth);
    canvasRef.current.setAttribute("height", baseRef.current.clientHeight);

    const graph = new LGraph();
    const graphCanvas = new LGraphCanvas(canvasRef.current, graph);

    graphCanvas.getMenuOptions = () => [
      {
        content: "Add Node",
        has_submenu: true,
        callback: addNode({
          // filterNodeTypes: (nodeTypeKey) => {
          //   console.log("filterNodeTypes", nodeTypeKey);
          //   return true;
          // },
          // mapMenuLabel: (entry, path) => {
          //   console.log("mapMenuLabel", entry, path);
          //   return entry;
          // },
          // mapEntryLabel: (entry, path) => {
          //   console.log("mapEntryLabel", entry, path);
          //   return entry;
          // }
        })
      },
      { content: "Add Group", has_submenu: false, callback: addGroup() }
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
