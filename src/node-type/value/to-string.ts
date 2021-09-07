import toString from "lodash/fp/toString";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "ToString";

class ToStringNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("value")],
        output: [dataSocket("string")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(0, toString(this.getInputData(0)));
  }
}

export default ToStringNode;
