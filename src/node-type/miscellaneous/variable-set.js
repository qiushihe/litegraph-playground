import VariableStorage from "./variable-storage";

const nodeType = {
  title: "VariableSet",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      static variables = {};

      constructor() {
        super(nodeType.title);

        this.addInput("action", LiteGraph.ACTION);
        this.addInput("in", "");
        this.addOutput("event", LiteGraph.EVENT);

        this.properties = { name: "my-var" };
        this.resizable = false;

        this.tasks = [];

        this.storage = VariableStorage.getDefaultInstance();
      }

      onAction(action) {
        if (action === "action") {
          this.tasks.push({ name: "set-value" });
          this.tasks.push({ name: "send-signal" });
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();

          if (task.name === "set-value") {
            if (this.isInputConnected(1)) {
              this.storage.setValue(this.properties.name, this.getInputData(1));
            }
          } else if (task.name === "send-signal") {
            this.triggerSlot(0, "");
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
