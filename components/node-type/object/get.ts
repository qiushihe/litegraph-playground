import getOr from "lodash/fp/getOr";

import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Get";

class GetNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("object"), dataSocket("key")],
        output: [dataSocket("value")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(
      0,
      getOr(null, this.getInputDataOr<string>("", 1))(this.getInputData(0))
    );
  }
}

export default GetNode;
