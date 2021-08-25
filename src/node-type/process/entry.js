const nodeType = {
  title: "Entry",
  defaultClass: null
};

const defineNodeType = ({ LGraphNode, LiteGraph }) => {
  if (nodeType.defaultClass === null) {
    nodeType.defaultClass = class extends LGraphNode {
      static title = nodeType.title;

      constructor() {
        super(nodeType.title);

        this.addInput("action", LiteGraph.ACTION);
        this.addInput("data", "");
        this.addOutput("event", LiteGraph.EVENT);
        this.addOutput("data", "");

        this.properties = { name: "my-entry" };
        this.tasks = [];
      }

      sendSignal(param) {
        this.tasks.push({ name: "send-signal", param });
      }

      onAction(action, param) {
        if (action === "action") {
          this.sendSignal(param);
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();

          if (task.name === "send-signal") {
            if (task.param && task.param.inputData !== undefined) {
              this.setOutputData(1, task.param.inputData);
            } else {
              this.setOutputData(1, this.getInputData(1));
            }
            this.triggerSlot(0, task.param);
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
