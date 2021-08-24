import join from "lodash/fp/join";

const nodeType = {
  title: "Join",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("array", "array");
        this.addInput("separator", "");
        this.addOutput("string", "");
      }

      onExecute() {
        this.setOutputData(
          0,
          join(this.getInputData(1) || "")(this.getInputData(0))
        );
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
