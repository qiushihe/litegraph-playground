import keys from "lodash/fp/keys";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Keys";

class KeysNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("object")],
        output: [dataSocket("key[]")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(0, keys(this.getInputData(0)));
  }
}

export default KeysNode;
