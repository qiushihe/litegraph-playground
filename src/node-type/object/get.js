import getOr from "lodash/fp/getOr";

const nodeType = {
  title: "Get",
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
        this.addOutput("value", "");
      }

      onExecute() {
        this.setOutputData(
          0,
          getOr(null, this.getInputData(1))(this.getInputData(0))
        );
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;