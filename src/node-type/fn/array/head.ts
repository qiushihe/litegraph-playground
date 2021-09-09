import first from "lodash/fp/first";

import BaseNode, { dataSocket } from "../../base-node";

const TITLE = "Head";

class HeadNode extends BaseNode {
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
  execute(array: unknown[]): unknown {
    return first(array);
  }

  onExecute() {
    this.setOutputData(0, this.execute);
  }
}

export default HeadNode;
