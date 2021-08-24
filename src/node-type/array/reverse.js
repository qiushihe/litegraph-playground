import reverse from "lodash/fp/reverse";

const nodeType = {
  title: "Reverse",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("array", "array");
        this.addOutput("reversed", "array");
      }

      onExecute() {
        this.setOutputData(0, reverse(this.getInputData(0)));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
