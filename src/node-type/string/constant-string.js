const nodeType = {
  title: "ConstantString",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addOutput("string", "");

        this.properties.value = "";
        this.resizable = false;
      }

      onExecute() {
        this.setOutputData(0, this.properties.value);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
