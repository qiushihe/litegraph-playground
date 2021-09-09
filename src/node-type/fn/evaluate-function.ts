import BaseNode, { dataSocket } from "../base-node";

const TITLE = "EvaluateFunction";

type FnArg = (arg1: unknown, arg2: unknown) => unknown;

class EvaluateFunctionNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [
          dataSocket("fn"),
          dataSocket("argument1"),
          dataSocket("argument2")
        ],
        output: [dataSocket("output")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    const fn = this.getInputData<FnArg>(0);

    if (fn) {
      this.setOutputData(
        0,
        fn(this.getInputData<never>(1), this.getInputData<never>(2))
      );
    }
  }
}

export default EvaluateFunctionNode;
