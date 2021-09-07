import set from "lodash/fp/set";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Set";

class SetNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("object"), dataSocket("key"), dataSocket("value")],
        output: [dataSocket("object")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(
      0,
      set(
        this.getInputDataOr<string>("", 1),
        this.getInputData(2)
      )(this.getInputDataOr<Record<string, unknown>>({}, 0))
    );
  }
}

export default SetNode;
