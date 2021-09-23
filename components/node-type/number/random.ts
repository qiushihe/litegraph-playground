import random from "lodash/random";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Random";

class RandomNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("min"), dataSocket("max"), dataSocket("floating")],
        output: [dataSocket("number")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    const min = parseFloat(this.getInputDataOr<string>("", 0)) || 0;
    const max =
      parseFloat(this.getInputDataOr<string>("", 1)) || Number.MAX_SAFE_INTEGER;
    const floating = this.getInputDataOr<boolean>(false, 2);

    this.setOutputData(0, random(min, max, floating));
  }
}

export default RandomNode;
