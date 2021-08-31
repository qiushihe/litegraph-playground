const nodeType = {
  title: "SquareRoot",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("A", "");
        this.addOutput("sqrt(A)", "");

        this.resizable = false;
      }

      onExecute() {
        let A = this.getInputData(0);
        if (A === undefined) {
          A = 0;
        }

        this.setOutputData(0, Math.sqrt(A));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
