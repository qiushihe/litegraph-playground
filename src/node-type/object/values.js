import values from "lodash/fp/values";

const nodeType = {
  title: "Values",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("object", "");
        this.addOutput("value[]", "");

        this.resizable = false;
      }

      onExecute() {
        this.setOutputData(0, values(this.getInputData(0)));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
