import BaseNode, { dataSocket } from "../base-node";

import VariableStorage from "./variable-storage";

const TITLE = "VariableGet";

class VariableGetNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        input: [dataSocket("fallback")],
        output: [dataSocket("value")]
      },
      properties: [["name", "my-var"]]
    });

    this.resizable = false;
  }

  getStorage(): VariableStorage {
    return VariableStorage.getDefaultInstance();
  }

  onExecute() {
    const value = this.getStorage().getValue(
      this.getPropertyOr<string>("", "name")
    );

    if (value !== undefined) {
      this.setOutputData(0, value);
    } else {
      this.setOutputData(0, this.getInputData(0));
    }
  }
}

export default VariableGetNode;
