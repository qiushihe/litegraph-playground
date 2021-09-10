import BaseNode, { dataSocket } from "../base-node";

const TITLE = "ConstantArray";

class ConstantArrayNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        output: [dataSocket("array"), dataSocket("length")]
      },
      metadata: [["array", []]]
    });

    this.properties.value = "";
    this.resizable = false;
  }

  onPropertyChanged(propertyName: string, propertyValue: unknown) {
    if (propertyName === "value") {
      try {
        this.setMeta("array", JSON.parse(`[${propertyValue}]`));
      } catch {
        this.setMeta("array", []);
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.getMetaOr([], "array"));
    this.setOutputData(1, this.getMetaOr([], "array").length);
  }
}

export default ConstantArrayNode;
