import split from "lodash/fp/split";

const nodeType = {
  title: "Split",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("string", "");
        this.addInput("separator", "");
        this.addOutput("string[]", "");

        this.resizable = false;
      }

      onExecute() {
        this.setOutputData(
          0,
          split(this.getInputData(1))(this.getInputData(0))
        );
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
