import clamp from "lodash/fp/clamp";

const nodeType = {
  title: "Clamp",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("number", "");
        this.addInput("min", "");
        this.addInput("max", "");
        this.addOutput("clamped", "");
      }

      onExecute() {
        const number = parseFloat(this.getInputData(0)) || 0;

        this.setOutputData(
          0,
          clamp(
            this.getInputData(1) || -Infinity,
            this.getInputData(2) || Infinity
          )(number)
        );
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
