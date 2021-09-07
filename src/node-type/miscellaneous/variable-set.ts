import BaseNode, { dataSocket, signalSocket } from "../base-node";

import VariableStorage from "./variable-storage";

const TITLE = "VariableSet";

class VariableSetNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [signalSocket("action"), dataSocket("in")],
        output: [signalSocket("event")]
      },
      properties: [["name", "my-var"]]
    });

    this.resizable = false;
  }

  getStorage(): VariableStorage {
    return VariableStorage.getDefaultInstance();
  }

  onExecute() {
    const [taskName, taskParam] = this.getNextTask();

    if (taskName === "action::action") {
      if (this.isInputConnected(1)) {
        this.getStorage().setValue(
          this.getPropertyOr<string>("", "name"),
          this.getInputData(1)
        );
      }
      this.triggerSlot(0, taskParam);
    }
  }
}

export default VariableSetNode;
