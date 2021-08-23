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

        this.addOutput("fn", "function");

        this.execute = this.execute.bind(this);
      }

      execute(a, b) {
        return a + b;
      }

      onExecute() {
        this.setOutputData(0, this.execute);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
