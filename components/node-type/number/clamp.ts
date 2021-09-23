import clamp from "lodash/fp/clamp";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Clamp";

class ClampNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("number"), dataSocket("min"), dataSocket("max")],
        output: [dataSocket("clamped")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    const number = parseFloat(this.getInputDataOr<string>("", 0)) || 0;
    const min = parseFloat(this.getInputDataOr<string>("", 1)) || -Infinity;
    const max = parseFloat(this.getInputDataOr<string>("", 2)) || Infinity;

    this.setOutputData(0, clamp(min, max)(number));
  }
}

export default ClampNode;
