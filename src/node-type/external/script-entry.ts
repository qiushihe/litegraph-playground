import BaseNode, { dataSocket, signalSocket } from "../base-node";

const TITLE = "ScriptEntry";

type SignalParam = {
  inputData?: unknown;
};

class ScriptEntryNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [signalSocket("action"), dataSocket("data")],
        output: [signalSocket("event"), dataSocket("data")]
      }
    });

    this.properties = { name: "my-entry" };
    this.resizable = false;
  }

  // Called externally by graph runner.
  sendSignal(param: unknown): void {
    this.enqueueTask("send-signal", param);
  }

  onExecute() {
    const [taskName, taskParam] = this.getNextTask<SignalParam>();

    if (taskName === "action::action" || taskName === "send-signal") {
      if (taskParam && taskParam.inputData !== undefined) {
        this.setOutputData(1, taskParam.inputData);
      } else {
        this.setOutputData(1, this.getInputData(1));
      }
      this.triggerSlot(0, taskParam);
    }
  }
}

export default ScriptEntryNode;
