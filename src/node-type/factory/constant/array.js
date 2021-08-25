const nodeType = {
  title: "Array",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addOutput("array", "array");
        this.addOutput("length", "number");

        this.properties.value = "";

        this.array = [];
      }

      onPropertyChanged(propertyName, propertyValue) {
        if (propertyName === "value") {
          try {
            this.array = JSON.parse(`[${propertyValue}]`);
          } catch {
            this.array = [];
          }
        }
      }

      onExecute() {
        this.setOutputData(0, this.array);
        this.setOutputData(1, this.array.length);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
