import Runner from "./runner";

import reduceFixture from "./reduce.fixture.json";

describe("runner", () => {
  it("should test reduce fixture", async () => {
    const runner = new Runner();

    runner.loadGraphData(reduceFixture);
    runner.silentConsoleLog();

    const result = await runner.run({
      entryName: "mainEntry",
      exitName: "mainExit",
      entryParam: {
        inputData: {
          numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          baseSum: 20
        }
      }
    });

    expect(result).toEqual("final: 65");
  });
});
