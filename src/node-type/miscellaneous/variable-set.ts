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

      // We can not trigger the output slot at the same time as the value of the variable is
      // updated in the storage object. The reason for that is because if we don't wait another
      // cycle, any corresponding `VariableGet` node would be return stale value because those
      // value are obtained at the same time as the triggering of the signal. By waiting another
      // cycle, we can ensure any corresponding `VariableGet` node gets the updated value before
      // this signal is triggered.
      this.enqueueTask("send-signal");
    } else if (taskName === "send-signal") {
      this.triggerSlot(0, taskParam);
    }
  }
}

export default VariableSetNode;
