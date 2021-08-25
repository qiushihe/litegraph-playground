const nodeType = {
  title: "Exit",
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

        this.properties = { name: "my-exit" };
        this.tasks = [];
        this.listeners = [];
      }

      addListener(listener) {
        this.listeners.push(listener);
      }

      fireEvent(param) {
        this.tasks.push({ name: "fire-event", param });
      }

      onAction(action, param) {
        if (action === "action") {
          this.fireEvent(param);
        }
      }

      onExecute() {
        if (this.tasks.length > 0) {
          const task = this.tasks.shift();

          if (task.name === "fire-event") {
            this.listeners.forEach((listener) => {
              listener(this.getInputData(1));
            });
          }
        }
      }
    };
  }

  return nodeType.defaultClass;
};

export default defineNodeType;
