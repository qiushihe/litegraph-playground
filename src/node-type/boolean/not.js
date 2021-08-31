const nodeType = {
  title: "Not",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("value", "");
        this.addOutput("!value", "");

        this.resizable = false;
      }

      onExecute() {
        this.setOutputData(0, !this.getInputData(0));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
