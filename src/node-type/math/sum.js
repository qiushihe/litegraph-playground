const nodeType = {
  title: "Sum",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("A", "number");
        this.addInput("B", "number");
        this.addOutput("A+B", "number");

        this.properties = { precision: 1 };
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

        this.setOutputData(0, A + B);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
