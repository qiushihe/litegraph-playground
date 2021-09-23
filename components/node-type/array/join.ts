import join from "lodash/fp/join";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Join";

class JoinNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("array"), dataSocket("separator")],
        output: [dataSocket("string")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(
      0,
      join(this.getInputData(1) || "")(this.getInputData(0))
    );
  }
}

export default JoinNode;
