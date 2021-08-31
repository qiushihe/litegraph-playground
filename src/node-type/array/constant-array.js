const nodeType = {
  title: "ConstantArray",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addOutput("array", "");
        this.addOutput("length", "");

        this.properties.value = "";
        this.resizable = false;

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
