import BaseNode, { dataSocket } from "../base-node";

const TITLE = "ConstantNumber";

class ConstantNumberNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        output: [dataSocket("value")]
      },
      metadata: [["value", ""]],
      properties: [["value", ""]]
    });

    this.resizable = false;
  }

  onPropertyChanged(name: string, value: unknown) {
    if (name === "value") {
      try {
        this.setMeta("value", parseFloat(value as string) || 0);
      } catch {
        this.setMeta("value", null);
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.getMetaOr<number>(0, "value"));
  }
}

export default ConstantNumberNode;
