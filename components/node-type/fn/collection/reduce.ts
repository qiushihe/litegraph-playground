import reduce from "lodash/fp/reduce";

import BaseNode, { dataSocket } from "../../base-node";

const TITLE = "Reduce";

class ReduceNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("reducer")],
        output: [dataSocket("fn")]
      }
    });

    this.execute = this.execute.bind(this);

    this.resizable = false;
  }

  // Call externally by consumer nodes.
  execute(accumulator: unknown, array: never): unknown {
    return reduce(this.getInputData(0) as never, accumulator)(array);
  }

  onExecute() {
    this.setOutputData(0, this.execute);
  }
}

export default ReduceNode;
