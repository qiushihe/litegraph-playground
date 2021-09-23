import BaseNode, { dataSocket } from "../base-node";

const TITLE = "LessThan";

class LessThanNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("A"), dataSocket("B")],
        output: [dataSocket("A<B")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    let A = this.getInputDataOr<number>(0, 0);
    if (A === undefined) {
      A = 0;
    }

    let B = this.getInputDataOr<number>(0, 1);
    if (B === undefined) {
      B = 0;
    }

    this.setOutputData(0, A < B);
  }
}

export default LessThanNode;
