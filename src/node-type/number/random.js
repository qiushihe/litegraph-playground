import random from "lodash/random";

const nodeType = {
  title: "Random",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("min", "");
        this.addInput("max", "");
        this.addInput("floating", "");
        this.addOutput("number", "");

        this.resizable = false;
      }

      onExecute() {
        const min = parseFloat(this.getInputData(0)) || 0;
        const max = parseFloat(this.getInputData(1)) || Number.MAX_SAFE_INTEGER;
        const floating = !!this.getInputData(2);

        this.setOutputData(0, random(min, max, floating));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
