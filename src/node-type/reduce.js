import { LGraphNode, LiteGraph } from "litegraph.js/build/litegraph.min";

class Reduce extends LGraphNode {
  static title = "Reduce";

  constructor() {
    super(Reduce.title);

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

export default Reduce;
