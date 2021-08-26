import toString from "lodash/fp/toString";

const nodeType = {
  title: "ToString",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("value", "");
        this.addOutput("string", "");
      }

      onExecute() {
        this.setOutputData(0, toString(this.getInputData(0)));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
