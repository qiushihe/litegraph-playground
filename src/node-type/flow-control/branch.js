const nodeType = {
  title: "Branch",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("action", LiteGraph.ACTION);
        this.addInput("B?", "");
        this.addOutput("event A", LiteGraph.EVENT);
        this.addOutput("event B", LiteGraph.EVENT);

        this.resizable = false;

        this.tasks = [];
      }

      onAction(action, param) {
        if (action === "action") {
          this.tasks.push({ name: "send-signal", param });
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();

          if (task.name === "send-signal") {
            if (!!this.getInputData(1)) {
              setTimeout(() => {
                this.triggerSlot(1, "");
              }, 1);
            } else {
              setTimeout(() => {
                this.triggerSlot(0, "");
              }, 1);
            }
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
