import set from "lodash/fp/set";

const nodeType = {
  title: "Set",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("object", "");
        this.addInput("key", "");
        this.addInput("value", "");
        this.addOutput("object", "");
      }

      onExecute() {
        this.setOutputData(
          0,
          set(this.getInputData(1), this.getInputData(2))(this.getInputData(0))
        );
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
