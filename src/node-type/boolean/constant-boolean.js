const nodeType = {
  title: "ConstantBoolean",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addOutput("value", "");

        this.properties.value = "";
        this.resizable = false;

        this.value = null;
      }

      onPropertyChanged(propertyName, propertyValue) {
        if (propertyName === "value") {
          try {
            this.value = !!JSON.parse(`${propertyValue}`);
          } catch {
            this.value = null;
          }
        }
      }

      onExecute() {
        this.setOutputData(0, this.value);
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
