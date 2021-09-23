import get from "lodash/fp/get";

import BaseNode, { dataSocket } from "../../base-node";

const TITLE = "Get";

class GetNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("path")],
        output: [dataSocket("fn")]
      }
    });

    this.execute = this.execute.bind(this);

    this.resizable = false;
  }

  // Called externally by consumer nodes.
  execute(obj: never): unknown {
    return get(this.getInputDataOr<string>("", 0))(obj);
  }

  onExecute() {
    this.setOutputData(0, this.execute);
  }
}

export default GetNode;
