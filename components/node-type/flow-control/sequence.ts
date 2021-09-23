import times from "lodash/fp/times";

import BaseNode, { signalSocket } from "../base-node";

const TITLE = "Sequence";
const OUTPUTS_COUNT = 5;

class SequenceNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [signalSocket("action")],
        output: times(() => signalSocket(""))(OUTPUTS_COUNT)
      }
    });

    this.resizable = false;
  }

  onExecute() {
    const [taskName, taskParam] = this.getNextTask();

    if (taskName === "action::action") {
      times((index) => {
        if (this.isOutputConnected(index)) {
          this.triggerSlot(index, taskParam);
        }
      })(OUTPUTS_COUNT);
    }
  }
}

export default SequenceNode;
