import { LGraphNode, LiteGraph } from "litegraph.js/build/litegraph.min";

class ConsoleLog extends LGraphNode {
  static title = "ConsoleLog";

  constructor() {
    super(ConsoleLog.title);

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

export default ConsoleLog;
