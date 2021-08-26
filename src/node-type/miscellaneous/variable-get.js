import VariableStorage from "./variable-storage";

const nodeType = {
  title: "VariableGet",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      static variables = {};

      constructor() {
        super(nodeType.title);

        this.addInput("fallback", "");
        this.addOutput("value", "");

        this.properties = { name: "my-var" };

        this.storage = VariableStorage.getDefaultInstance();
      }

      onExecute() {
        const value = this.storage.getValue(this.properties.name);

        if (value !== undefined) {
          this.setOutputData(0, value);
        } else {
          this.setOutputData(0, this.getInputData(0));
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
