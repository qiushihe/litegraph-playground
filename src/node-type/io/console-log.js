const nodeType = {
  title: "ConsoleLog",
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

        this.tasks = [];
      }

      onAction(action) {
        if (action === "action") {
          this.tasks.push({ name: "log-data" });
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();
          if (task.name === "log-data") {
            console.log(this.getInputData(1));
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
