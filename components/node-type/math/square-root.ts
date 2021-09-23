import BaseNode, { dataSocket } from "../base-node";

const TITLE = "SquareRoot";

class SquareRootNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("A")],
        output: [dataSocket("sqrt(A)")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    let A = this.getInputDataOr<number>(0, 0);
    if (A === undefined) {
      A = 0;
    }

    this.setOutputData(0, Math.sqrt(A));
  }
}

export default SquareRootNode;
