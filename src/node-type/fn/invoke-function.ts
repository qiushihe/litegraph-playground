import BaseNode, { dataSocket, signalSocket } from "../base-node";

const TITLE = "InvokeFunction";

type FnArg = (arg1: unknown, arg2: unknown) => unknown;

class InvokeFunctionNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [
          signalSocket("action"),
          dataSocket("fn"),
          dataSocket("argument1"),
          dataSocket("argument2")
        ],
        output: [signalSocket("event"), dataSocket("output")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    const [taskName] = this.getNextTask();

    if (taskName === "action::action") {
      const fn = this.getInputData<FnArg>(1);

      if (fn) {
        this.setOutputData(
          1,
          fn(this.getInputData<never>(2), this.getInputData<never>(3))
        );
      }

      this.triggerSlot(0, "");
    }
  }
}

export default InvokeFunctionNode;
