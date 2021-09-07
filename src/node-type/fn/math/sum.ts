import BaseNode, { dataSocket } from "../../base-node";

const TITLE = "Sum";

class SumNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        output: [dataSocket("fn")]
      }
    });

    this.execute = this.execute.bind(this);

    this.resizable = false;
  }

  // Called externally by consumer nodes.
  execute(a: number, b: number): number {
    return a + b;
  }

  onExecute() {
    this.setOutputData(0, this.execute);
  }
}

export default SumNode;
