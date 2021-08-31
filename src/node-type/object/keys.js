import keys from "lodash/fp/keys";

const nodeType = {
  title: "Keys",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("object", "");
        this.addOutput("key[]", "");

        this.resizable = false;
      }

      onExecute() {
        this.setOutputData(0, keys(this.getInputData(0)));
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
