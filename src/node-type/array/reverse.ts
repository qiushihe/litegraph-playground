import reverse from "lodash/fp/reverse";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "ReverseNode";

class ReverseNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("array")],
        output: [dataSocket("reversed")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(0, reverse(this.getInputDataOr<unknown[]>([], 0)));
  }
}

export default ReverseNode;
