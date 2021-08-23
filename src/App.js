import React, { useEffect, useRef } from "react";
import { LGraph, LGraphCanvas, LiteGraph, LGraphNode } from "litegraph.js";
import { v4 as uuidv4 } from "uuid";
import flow from "lodash/fp/flow";
import keys from "lodash/fp/keys";
import reduce from "lodash/fp/reduce";
import compact from "lodash/fp/compact";
import forEach from "lodash/fp/forEach";
import filter from "lodash/fp/filter";
import map from "lodash/fp/map";
import set from "lodash/fp/set";
import trim from "lodash/fp/trim";
import split from "lodash/fp/split";
import join from "lodash/fp/join";
import over from "lodash/fp/over";
import startsWith from "lodash/fp/startsWith";

import "litegraph.js/css/litegraph.css";

class SumNode extends LGraphNode {
  static title = "Sum";

  constructor() {
    super(SumNode.title);

    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("A+B", "number");

    this.properties = { precision: 1 };
  }

  onExecute() {
    let A = this.getInputData(0);
    if (A === undefined) {
      A = 0;
    }

    let B = this.getInputData(1);
    if (B === undefined) {
      B = 0;
    }

    this.setOutputData(0, A + B);
  }
}

LiteGraph.registerNodeType("custom/sum", SumNode);

class ReduceNode extends LGraphNode {
  static title = "Reduce";

  constructor() {
    super(ReduceNode.title);

    this.addInput("start", LiteGraph.ACTION);
    this.addInput("array", "array");
    this.addInput("initial", "");
    this.addInput("iterate", LiteGraph.ACTION);
    this.addInput("accumulator", "");

    this.addOutput("iterator", LiteGraph.EVENT);
    this.addOutput("accumulated", "");
    this.addOutput("element", "");
    this.addOutput("done", LiteGraph.EVENT);
    this.addOutput("final", "");

    this.index = 0;
    this.accumulator = null;

    this.tasks = [];
  }

  onAction(action) {
    if (action === "start") {
      this.tasks.push("reset");
    } else if (action === "iterate") {
      this.tasks.push("update-accumulator");
      this.tasks.push("increment-index");
    }
  }

  onExecute() {
    const inputArray = this.getInputData(1);

    if (this.tasks.length > 0) {
      const task = this.tasks.shift();

      if (task === "reset") {
        this.index = 0;
        this.accumulator = this.getInputData(2);

        if (inputArray.length <= 0) {
          this.tasks.push("output-final");
          this.tasks.push("signal-done");
        } else {
          this.tasks.push("output-iterator");
          this.tasks.push("signal-iterator");
        }
      } else if (task === "update-accumulator") {
        this.accumulator = this.getInputData(4);
      } else if (task === "increment-index") {
        this.index = this.index + 1;

        if (this.index <= inputArray.length - 1) {
          this.tasks.push("output-iterator");
          this.tasks.push("signal-iterator");
        } else {
          this.tasks.push("output-final");
          this.tasks.push("signal-done");
        }
      } else if (task === "output-iterator") {
        this.setOutputData(1, this.accumulator);
        this.setOutputData(2, inputArray[this.index]);
      } else if (task === "signal-iterator") {
        this.triggerSlot(0, "");
      } else if (task === "output-final") {
        this.setOutputData(4, this.accumulator);
      } else if (task === "signal-done") {
        this.triggerSlot(3, "");
      }
    }
  }
}

LiteGraph.registerNodeType("custom/reduce", ReduceNode);

class PortalNode extends LGraphNode {
  static title = "Portal";

  static portals = {};

  constructor() {
    super(PortalNode.title);

    this.addInput("action", LiteGraph.ACTION);
    this.addOutput("event", LiteGraph.EVENT);

    this.properties = { name: "myevent" };

    this.uuid = uuidv4();
    this.tasks = [];
  }

  replicateSignal(param) {
    this.tasks.push({ name: "replicate-signal", param });
  }

  onAdded() {
    PortalNode.portals[this.uuid] = this;
  }

  onRemoved() {
    delete PortalNode.portals[this.uuid];
  }

  onAction(action, param) {
    if (action === "action") {
      this.tasks.push({ name: "send-signal", param });
    }
  }

  onExecute() {
    if (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task.name === "send-signal") {
        Object.values(PortalNode.portals)
          .filter((portal) => {
            return (
              portal.uuid !== this.uuid &&
              portal.properties.name === this.properties.name
            );
          })
          .forEach((portal) => {
            portal.replicateSignal(task.param);
          });
        this.triggerSlot(0, task.param);
      } else if (task.name === "replicate-signal") {
        this.triggerSlot(0, task.param);
      }
    }
  }
}

LiteGraph.registerNodeType("custom/portal", PortalNode);

class SumFnNode extends LGraphNode {
  static title = "SumFn";

  constructor() {
    super(SumFnNode.title);

    this.addOutput("fn", "function");

    this.execute = this.execute.bind(this);
  }

  execute(a, b) {
    return a + b;
  }

  onExecute() {
    this.setOutputData(0, this.execute);
  }
}

LiteGraph.registerNodeType("custom/sumFn", SumFnNode);

class ReduceFnNode extends LGraphNode {
  static title = "ReduceFn";

  constructor() {
    super(ReduceFnNode.title);

    this.addInput("reducer", "function");
    this.addOutput("fn", "function");

    this.execute = this.execute.bind(this);
  }

  execute(accumulator, array) {
    return reduce(this.getInputData(0), accumulator)(array);
  }

  onExecute() {
    this.setOutputData(0, this.execute);
  }
}

LiteGraph.registerNodeType("custom/reduceFn", ReduceFnNode);

class InvokeFunctionNode extends LGraphNode {
  static title = "InvokeFunction";

  constructor() {
    super(InvokeFunctionNode.title);

    this.addInput("action", LiteGraph.ACTION);
    this.addInput("fn", "function");
    this.addInput("argument1", "");
    this.addInput("argument2", "");

    this.addOutput("event", LiteGraph.EVENT);
    this.addOutput("output", "");

    this.tasks = [];
  }

  onAction(action) {
    if (action === "action") {
      this.tasks.push({ name: "invoke-function" });
    }
  }

  onExecute() {
    if (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task.name === "invoke-function") {
        const fn = this.getInputData(1);
        const argument1 = this.getInputData(2);
        const argument2 = this.getInputData(3);

        this.setOutputData(1, fn(argument1, argument2));
        this.triggerSlot(0, "");
      }
    }
  }
}

LiteGraph.registerNodeType("custom/invokeFunction", InvokeFunctionNode);

class ButtonNode extends LGraphNode {
  static title = "Button";

  constructor() {
    super(ButtonNode.title);

    this.addOutput("", LiteGraph.EVENT);

    this.properties = { label: "A Button", fontSize: 16 };
    this.size = [164, 84];

    this.active = false;
  }

  onDrawForeground(ctx) {
    const margin = 10;
    ctx.fillStyle = "black";
    ctx.fillRect(
      margin + 1,
      margin + 1,
      this.size[0] - margin * 2,
      this.size[1] - margin * 2
    );
    ctx.fillStyle = "#AAF";
    ctx.fillRect(
      margin - 1,
      margin - 1,
      this.size[0] - margin * 2,
      this.size[1] - margin * 2
    );
    ctx.fillStyle = this.active ? "white" : this.mouseOver ? "#668" : "#334";
    ctx.fillRect(
      margin,
      margin,
      this.size[0] - margin * 2,
      this.size[1] - margin * 2
    );

    ctx.textAlign = "center";
    ctx.fillStyle = this.active ? "black" : "white";
    ctx.font = this.properties.fontSize + "px Arial";
    ctx.fillText(
      this.properties.label,
      this.size[0] * 0.5,
      this.size[1] * 0.5 + this.properties.fontSize * 0.3
    );
    ctx.textAlign = "left";
  }

  onMouseDown(evt, pos, canvas) {
    if (
      pos[0] > 1 &&
      pos[1] > 1 &&
      pos[0] < this.size[0] - 2 &&
      pos[1] < this.size[1] - 2
    ) {
      this.active = true;
      this.triggerSlot(0, "");
      return true;
    }
  }

  onMouseUp(evt, pos, canvas) {
    this.active = false;
  }

  onExecute() {}
}

LiteGraph.registerNodeType("custom/button", ButtonNode);

class ConsoleLogNode extends LGraphNode {
  static title = "ConsoleLog";

  constructor() {
    super(ConsoleLogNode.title);

    this.addInput("action", LiteGraph.ACTION);
    this.addInput("data", "");

    this.tasks = [];
  }

  onAction(action) {
    if (action === "action") {
      this.tasks.push({ name: "log-data" });
    }
  }

  onExecute() {
    if (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task.name === "log-data") {
        console.log(this.getInputData(1));
      }
    }
  }
}

LiteGraph.registerNodeType("custom/consoleLog", ConsoleLogNode);

function App() {
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
        callback: (node, options, evt, parentMenu, callback) => {
          const canvas = LGraphCanvas.active_canvas;
          const canvasWindow = canvas.getCanvasWindow();
          const canvasGraph = canvas.graph;

          if (!canvasGraph) {
            return;
          }

          const buildMenu = (baseCategory, parentMenu) => {
            const entries = [];

            const noteTypesCategories = LiteGraph.getNodeTypesCategories(
              canvas.filter || canvasGraph.filter
            );

            console.log("noteTypesCategories", noteTypesCategories);

            flow([
              filter(startsWith(baseCategory)),
              compact,
              forEach((category) => {
                console.log("category", category);
                const baseCategoryRegex = new RegExp(`^(${baseCategory})`);
                const categoryName = category
                  .replace(baseCategoryRegex, "")
                  .split("/")[0];

                const categoryPath =
                  baseCategory === ""
                    ? categoryName + "/"
                    : baseCategory + categoryName + "/";

                // in case it has a namespace like "shader::math/rand" it hides the namespace
                const name =
                  categoryName.indexOf("::") !== -1
                    ? categoryName.split("::")[1]
                    : categoryName;

                const index = entries.findIndex(
                  (entry) => entry.value === categoryPath
                );

                if (index === -1) {
                  entries.push({
                    value: categoryPath,
                    content: name,
                    has_submenu: true,
                    callback: function (value, event, mouseEvent, contextMenu) {
                      buildMenu(value.value, contextMenu);
                    }
                  });
                }
              })
            ])(noteTypesCategories);

            LiteGraph.getNodeTypesInCategory(
              baseCategory.slice(0, -1),
              canvas.filter || canvasGraph.filter
            ).forEach((node) => {
              if (node.skip_list) {
                return;
              }

              entries.push({
                value: node.type,
                content: node.title,
                has_submenu: false,
                callback: (value, event, mouseEvent, contextMenu) => {
                  const firstEvt = contextMenu.getFirstEvent();
                  canvas.graph.beforeChange();

                  const node = LiteGraph.createNode(value.value);
                  if (node) {
                    node.pos = canvas.convertEventToCanvasOffset(firstEvt);
                    canvas.graph.add(node);
                  }

                  if (callback) {
                    callback(node);
                  }

                  canvas.graph.afterChange();
                }
              });
            });

            new LiteGraph.ContextMenu(
              entries,
              { event: evt, parentMenu: parentMenu },
              canvasWindow
            );
          };

          buildMenu("", parentMenu);
          return false;
        }
      },
      {
        content: "Add Node 2",
        has_submenu: true,
        callback: (node, options, evt, parentMenu, callback) => {
          const canvas = LGraphCanvas.active_canvas;
          const canvasWindow = canvas.getCanvasWindow();
          const canvasGraph = canvas.graph;

          if (!canvasGraph) {
            return;
          }

          const filterNodeTypes = () => true;

          const indexedNodeTypes = flow([
            keys,
            filter(filterNodeTypes),
            map(trim),
            compact,
            reduce(
              (acc, nodeTypeKey) =>
                flow([
                  split("/"),
                  join("."),
                  (path) =>
                    set(path, LiteGraph.registered_node_types[nodeTypeKey])(acc)
                ])(nodeTypeKey),
              {}
            )
          ])(LiteGraph.registered_node_types);

          console.log("indexedNodeTypes", indexedNodeTypes);

          const buildMenu = (baseCategory, parentMenu) => {
            const entries = [];

            const noteTypesCategories = LiteGraph.getNodeTypesCategories(
              canvas.filter || canvasGraph.filter
            );

            flow([
              filter(startsWith(baseCategory)),
              compact,
              forEach((category) => {
                const baseCategoryRegex = new RegExp(`^(${baseCategory})`);
                const categoryName = category
                  .replace(baseCategoryRegex, "")
                  .split("/")[0];

                const categoryPath =
                  baseCategory === ""
                    ? categoryName + "/"
                    : baseCategory + categoryName + "/";

                // in case it has a namespace like "shader::math/rand" it hides the namespace
                const name =
                  categoryName.indexOf("::") !== -1
                    ? categoryName.split("::")[1]
                    : categoryName;

                const index = entries.findIndex(
                  (entry) => entry.value === categoryPath
                );

                if (index === -1) {
                  entries.push({
                    value: categoryPath,
                    content: name,
                    has_submenu: true,
                    callback: function (value, event, mouseEvent, contextMenu) {
                      buildMenu(value.value, contextMenu);
                    }
                  });
                }
              })
            ])(noteTypesCategories);

            LiteGraph.getNodeTypesInCategory(
              baseCategory.slice(0, -1),
              canvas.filter || canvasGraph.filter
            ).forEach((node) => {
              if (node.skip_list) {
                return;
              }

              entries.push({
                value: node.type,
                content: node.title,
                has_submenu: false,
                callback: (value, event, mouseEvent, contextMenu) => {
                  const firstEvt = contextMenu.getFirstEvent();
                  canvas.graph.beforeChange();

                  const node = LiteGraph.createNode(value.value);
                  if (node) {
                    node.pos = canvas.convertEventToCanvasOffset(firstEvt);
                    canvas.graph.add(node);
                  }

                  if (callback) {
                    callback(node);
                  }

                  canvas.graph.afterChange();
                }
              });
            });

            new LiteGraph.ContextMenu(
              entries,
              { event: evt, parentMenu: parentMenu },
              canvasWindow
            );
          };

          buildMenu("", parentMenu);
          return false;
        }
      },
      { content: "Add Group", callback: LGraphCanvas.onGroupAdd }
    ];

    graph.onStopEvent = () => {
      console.log(graph.serialize());
    };

    graph.start();

    window.lalaGraph = graph;
  }, []);

  return (
    <div ref={baseRef} style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
