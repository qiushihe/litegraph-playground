import eq from "lodash/fp/eq";

import BaseNode, { dataSocket } from "../../base-node";

const TITLE = "Equal";

class EqualNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("value")],
        output: [dataSocket("fn")]
      }
    });

    this.execute = this.execute.bind(this);

    this.resizable = false;
  }

  // Called externally by consumer nodes.
  execute(value: unknown): boolean {
    return eq(value)(this.getInputData(0));
  }

  onExecute() {
    this.setOutputData(0, this.execute);
  }
}

export default EqualNode;
