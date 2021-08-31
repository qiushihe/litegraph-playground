const nodeType = {
  title: "Stringify",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("object", "");
        this.addOutput("string", "");

        this.resizable = false;
      }

      onExecute() {
        this.setOutputData(0, JSON.stringify(this.getInputData(0)));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
