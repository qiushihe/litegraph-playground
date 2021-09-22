import { LiteGraph, LGraph } from "../litegraph-core";
import { PREFIX } from "../enum/node-type.enum";
import { registerNodes } from "../node-type";

import helloWorldFixture from "../../fixture/hello-world-scriptable.json";
import reduceFixture from "../../fixture/reduce.fixture.json";

import Runner from "./runner";

describe("runner", () => {
  let graph: LGraph;

  beforeAll(() => {
    graph = new LGraph();
    registerNodes(PREFIX, LiteGraph.registerNodeType.bind(LiteGraph));
  });

  it("should test reduce fixture", async () => {
    const runner = new Runner(graph);

    runner.loadGraphData(reduceFixture);
    runner.silentConsoleLog();

    const result = await runner.run("mainEntry", "mainExit", {
      inputData: {
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        baseSum: 20
      }
    });

    expect(result).toEqual("final: 65");
  });

  it("should test hello world fixture", async () => {
    const runner = new Runner(graph);

    runner.loadGraphData(helloWorldFixture);
    runner.silentConsoleLog();

    const result = await runner.run("main-entry", "main-exit", {
      inputData: "Wes"
    });

    expect(result).toEqual("Hello Wes!");
  });
});
