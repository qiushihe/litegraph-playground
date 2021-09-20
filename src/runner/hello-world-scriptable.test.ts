import Runner from "./runner";

import testGraph from "./hello-world-scriptable.json";

describe("Hello World (Scriptable)", () => {
  it("should test reduce fixture", async () => {
    const runner = new Runner();

    runner.loadGraphData(testGraph);
    runner.silentConsoleLog();

    const result = await runner.run("main-entry", "main-exit", {
      inputData: "Wes"
    });

    expect(result).toEqual("Hello Wes!");
  });
});
