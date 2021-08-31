import reduce from "lodash/fp/reduce";

const nodeType = {
  title: "Reduce",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("reducer", "function");
        this.addOutput("fn", "function");

        this.execute = this.execute.bind(this);

        this.resizable = false;
      }

      execute(accumulator, array) {
        return reduce(this.getInputData(0), accumulator)(array);
      }

      onExecute() {
        this.setOutputData(0, this.execute);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
