import times from "lodash/fp/times";

const nodeType = {
  title: "MakeArray",
  defaultClass: null
};

const INPUTS_COUNT = 5;

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        times(() => {
          this.addInput("", "");
        })(INPUTS_COUNT);

        this.addOutput("array", "");
      }

      onExecute() {
        const array = [];

        times((index) => {
          if (this.isInputConnected(index)) {
            array.push(this.getInputData(index));
          }
        })(INPUTS_COUNT);

        this.setOutputData(0, array);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
