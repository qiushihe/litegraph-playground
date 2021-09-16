import { LGraph, LiteGraph } from "../litegraph-core";

import flow from "lodash/fp/flow";
import find from "lodash/fp/find";
import get from "lodash/fp/get";
import eq from "lodash/fp/eq";

import { PREFIX } from "../enum/node-type.enum";
import { registerNodes } from "../node-type";
import ConsoleLogNode from "../node-type/output/console-log";
import ScriptExitNode from "../node-type/external/script-exit";

class Runner {
  graph: LGraph;
  promise: Promise<unknown>;
  resolvePromise: (data: unknown) => void;
  rejectPromise: (data: unknown) => void;

  constructor() {
    registerNodes(PREFIX, LiteGraph.registerNodeType.bind(LiteGraph));

    this.graph = new LGraph();

    this.resolvePromise = () => {};
    this.rejectPromise = () => {};

    this.promise = new Promise((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
  }

  loadGraphData(data: unknown) {
    this.graph.configure(data, false);
  }

  silentConsoleLog() {
    this.graph
      .findNodesByType(`${PREFIX}input-output/console-log`)
      .forEach((node) => (node as ConsoleLogNode).disableOutput());
  }

  run(entryName: string, exitName: string, entryParam: unknown) {
    this.graph.start();

    const entry = find(
      flow([get("properties.name"), eq(JSON.stringify(entryName))])
    )(this.graph.findNodesByType(`${PREFIX}external/script-entry`));

    if (entry) {
      entry.sendSignal(entryParam);

      const exit: ScriptExitNode = find(
        flow([get("properties.name"), eq(JSON.stringify(exitName))])
      )(this.graph.findNodesByType(`${PREFIX}external/script-exit`));

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
