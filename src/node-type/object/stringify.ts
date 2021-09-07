import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Stringify";

class StringifyNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("object")],
        output: [dataSocket("string")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(0, JSON.stringify(this.getInputData(0)));
  }
}

export default StringifyNode;
