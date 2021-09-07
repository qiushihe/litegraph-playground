import BaseNode, { dataSocket } from "../base-node";

const TITLE = "Parse";

class ParseNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("string")],
        output: [dataSocket("object")]
      }
    });

    this.resizable = false;
  }

  onExecute() {
    try {
      this.setOutputData(0, JSON.parse(this.getInputDataOr<string>("", 0)));
    } catch {
      this.setOutputData(0, null);
    }
  }
}

export default ParseNode;
