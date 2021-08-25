import {
  LGraph,
  LGraphNode,
  LiteGraph
} from "litegraph.js/build/litegraph.core";

import first from "lodash/fp/first";
import flow from "lodash/fp/flow";
import find from "lodash/fp/find";
import get from "lodash/fp/get";
import eq from "lodash/fp/eq";

import { PREFIX } from "../enum/node-type.enum";
import { registerNodes } from "../node-type";

class Runner {
  constructor() {
    registerNodes(PREFIX, LiteGraph.registerNodeType.bind(LiteGraph), {
      LGraphNode,
      LiteGraph
    });

    this.graph = new LGraph();

    this.promise = new Promise((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
  }

  loadGraphData(data) {
    this.graph.configure(data, false);
  }

  silentConsoleLog() {
    this.graph
      .findNodesByType("_custom::io/console-log")
      .forEach((node) => node.disableOutput());
  }

  run({ entryName, exitName, entryParam } = {}) {
    this.graph.start();

    const entry = find(flow([get("properties.name"), eq(entryName)]))(
      this.graph.findNodesByType("_custom::process/entry")
    );

    if (entry) {
      entry.sendSignal(entryParam);

      const exit = find(flow([get("properties.name"), eq(exitName)]))(
        this.graph.findNodesByType("_custom::process/exit")
      );

      if (exit) {
        exit.addListener((data) => this.resolvePromise(data));
      } else {
        this.resolvePromise(null);
      }
    } else {
      this.resolvePromise(null);
    }

    return this.promise;
  }
}

export default Runner;
