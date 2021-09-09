import find from "lodash/fp/find";

import BaseNode, { dataSocket } from "../../base-node";

const TITLE = "Find";

class FindNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("finder")],
        output: [dataSocket("fn")]
      }
    });

    this.execute = this.execute.bind(this);

    this.resizable = false;
  }

  // Call externally by consumer nodes.
  execute(collection: never): unknown {
    return find(this.getInputData(0) as never)(collection);
  }

  onExecute() {
    this.setOutputData(0, this.execute);
  }
}

export default FindNode;
