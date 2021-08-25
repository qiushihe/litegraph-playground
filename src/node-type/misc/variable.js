const nodeType = {
  title: "Variable",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      static variables = {};

      constructor() {
        super(nodeType.title);

        this.addInput("in", "");
        this.addOutput("out", "");

        this.properties = { name: "my-var" };
      }

      onAdded() {
        nodeType.defaultClass.variables[this.properties.name] = null;
      }

      onRemoved() {
        delete nodeType.defaultClass.variables[this.properties.name];
      }

      onExecute() {
        if (this.isInputConnected(0)) {
          nodeType.defaultClass.variables[this.properties.name] =
            this.getInputData(0);
        }

        this.setOutputData(
          0,
          nodeType.defaultClass.variables[this.properties.name]
        );
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
