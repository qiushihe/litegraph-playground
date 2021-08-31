const nodeType = {
  title: "Divide",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("A", "");
        this.addInput("B", "");
        this.addOutput("A/B", "");

        this.resizable = false;
      }

      onExecute() {
        let A = this.getInputData(0);
        if (A === undefined) {
          A = 0;
        }

        let B = this.getInputData(1);
        if (B === undefined) {
          B = 0;
        }

        this.setOutputData(0, A / B);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
