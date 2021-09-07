import size from "lodash/fp/size";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Size";

class SizeNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("input")],
        output: [dataSocket("size")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(0, size(this.getInputData(0)));
  }
}

export default SizeNode;
