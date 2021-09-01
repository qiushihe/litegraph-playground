const nodeType = {
  title: "Parse",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("string", "");
        this.addOutput("object", "");

        this.resizable = false;
      }

      onExecute() {
        try {
          this.setOutputData(0, JSON.parse(this.getInputData(0)));
        } catch {
          this.setOutputData(0, null);
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
