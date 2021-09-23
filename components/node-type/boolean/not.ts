import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Not";

class NotNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("value")],
        output: [dataSocket("!value")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    this.setOutputData(0, !this.getInputData(0));
  }
}

export default NotNode;
