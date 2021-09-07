import BaseNode, { dataSocket } from "../base-node";

const TITLE = "ConstantString";

class ConstantStringNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        output: [dataSocket("string")]
      },
      properties: [["value", ""]]
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(0, this.getPropertyOr<string>("", "value"));
  }
}

export default ConstantStringNode;
