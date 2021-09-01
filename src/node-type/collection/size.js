import size from "lodash/fp/size";

const nodeType = {
  title: "Size",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("input", "");
        this.addOutput("size", "");

        this.resizable = false;
      }

      onExecute() {
        this.setOutputData(0, size(this.getInputData(0)));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
