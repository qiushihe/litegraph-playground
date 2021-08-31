const nodeType = {
  title: "InvokeFunction",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("action", LiteGraph.ACTION);
        this.addInput("fn", "function");
        this.addInput("argument1", "");
        this.addInput("argument2", "");

        this.addOutput("event", LiteGraph.EVENT);
        this.addOutput("output", "");

        this.resizable = false;

        this.tasks = [];
      }

      onAction(action) {
        if (action === "action") {
          this.tasks.push({ name: "invoke-function" });
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();
          if (task.name === "invoke-function") {
            const fn = this.getInputData(1);
            const argument1 = this.getInputData(2);
            const argument2 = this.getInputData(3);

            this.setOutputData(1, fn(argument1, argument2));
            this.triggerSlot(0, "");
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
