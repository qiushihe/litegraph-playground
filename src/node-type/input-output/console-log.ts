import BaseNode, { dataSocket, signalSocket } from "../base-node";

const TITLE = "ConsoleLog";

class ConsoleLogNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [signalSocket("action"), dataSocket("in")],
        output: [signalSocket("event"), dataSocket("out")]
      },
      metadata: [["silent", false]]
    });

    this.resizable = false;
  }

  // Called externally.
  disableOutput() {
    this.setMeta("silent", true);
  }

  // Called externally.
  enableOutput() {
    this.setMeta("silent", false);
  }

  onExecute() {
    const [taskName, taskParam] = this.getNextTask();

    if (taskName === "action::action") {
      if (!this.getMeta<boolean>("silent")) {
        console.log(this.getInputData(1));
      }

      this.triggerSlot(0, taskParam);
      this.setOutputData(1, this.getInputData(1));
    }
  }
}

export default ConsoleLogNode;
