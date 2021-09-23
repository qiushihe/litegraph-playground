import BaseNode, { dataSocket, signalSocket } from "../base-node";

const TITLE = "Branch";

class BranchNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [signalSocket("action"), dataSocket("B?")],
        output: [signalSocket("event A"), signalSocket("event B")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    const [taskName, taskParam] = this.getNextTask();

    if (taskName === "action::action") {
      if (!!this.getInputData<boolean>(1)) {
        this.triggerSlot(1, taskParam);
      } else {
        this.triggerSlot(0, taskParam);
      }
    }
  }
}

export default BranchNode;
