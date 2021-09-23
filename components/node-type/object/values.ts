import values from "lodash/fp/values";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Values";

class ValuesNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("object")],
        output: [dataSocket("value[]")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(0, values(this.getInputData(0)));
  }
}

export default ValuesNode;
