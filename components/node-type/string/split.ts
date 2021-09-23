import split from "lodash/fp/split";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Split";

class SplitNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("string"), dataSocket("separator")],
        output: [dataSocket("string[]")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(
      0,
      split(this.getInputDataOr<string>("", 1))(
        this.getInputDataOr<string>("", 0)
      )
    );
  }
}

export default SplitNode;
