import BaseNode, { dataSocket } from "../base-node";

const TITLE = "ConstantBoolean";

class ConstantBooleanNode extends BaseNode {
  static title = TITLE;

  constructor() {
    super(TITLE, {
      sockets: {
        output: [dataSocket("value")]
      },
      metadata: [["value", undefined]]
    });

    this.properties.value = "";
    this.resizable = false;
  }

  onPropertyChanged(propertyName: string, propertyValue: unknown) {
    if (propertyName === "value") {
      try {
        this.setMeta("value", !!JSON.parse(`${propertyValue}`));
      } catch {
        this.setMeta("value", undefined);
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.getMetaOr(false, "value"));
  }
}

export default ConstantBooleanNode;
